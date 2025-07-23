import { useContext, useState } from "react";
import CropperModal from "../components/CropperModal";
import { AuthContext } from "../context/AuthContext";
import { auth, storage, db } from "../firebase";
import { deleteUser, reauthenticateWithCredential, signOut, updateProfile, EmailAuthProvider } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, getDoc, arrayRemove, deleteDoc } from "firebase/firestore";
import EditDisplayName from "../components/EditDisplayName";
import { useNavigate } from "react-router-dom";
import MyAvatar from "../components/MyAvatar";
import { ArrowLeft, Edit, X, UserX, LogOut, Lock, Loader2, MoreVertical, Trash2, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PHOTO_URL = "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53";

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    const myCategory = currentUser.isAnonymous ? 'guests' : 'users';
    const [showButton, setShowButton] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isUpdatingPP, setIsUpdatingPP] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // base64 or url
    const [croppedBlob, setCroppedBlob] = useState(null);

    // Handle file input change to show cropper
    const handleEditPP = (e) => {
        setPopoverOpen(false);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedImage(ev.target.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // When cropping is done
    const handleCropComplete = async (blob) => {
        setShowCropper(false);
        setIsUpdatingPP(true);
        setShowButton(false);
        try {
            toast({
                title: "Uploading",
                description: "Your profile picture is being updated...",
            });

            const storageRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');

            // Only delete the old profile picture if it's not the default
            if (currentUser.photoURL && currentUser.photoURL !== DEFAULT_PHOTO_URL) {
                try {
                    await getDownloadURL(storageRef);
                    await deleteObject(storageRef);
                } catch (error) {
                    // Ignore if not found
                    if (error.code !== "storage/object-not-found") {
                        throw error;
                    }
                }
            }

            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                    });
                    setIsUpdatingPP(false);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await Promise.all([
                            updateProfile(currentUser, {
                                photoURL: downloadURL,
                            }),
                            updateDoc(doc(db, myCategory, currentUser.uid), {
                                photoURL: downloadURL,
                            })
                        ]);

                        // Force refresh the auth state to update UI
                        await auth.currentUser.reload();

                        toast({
                            title: "Success",
                            description: "Profile picture updated successfully",
                        });

                        // Force re-render by updating state
                        setIsUpdatingPP(false);
                        setUploadProgress(0);
                    } catch (error) {
                        toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                        });
                        setIsUpdatingPP(false);
                    }
                }
            );
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setIsUpdatingPP(false);
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setSelectedImage(null);
    };

    const handleRemovePP = async () => {
        setPopoverOpen(false);
        try {
            const fileRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');
            try {
                await getDownloadURL(fileRef);
                await deleteObject(fileRef);
            } catch (error) {
                if (error.code !== "storage/object-not-found") {
                    throw error;
                }
            }

            const defaultPhotoURL = "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53";
            await updateProfile(currentUser, { photoURL: defaultPhotoURL });
            await updateDoc(doc(db, myCategory, currentUser.uid), { photoURL: defaultPhotoURL });
            
            toast({
                title: "Success",
                description: "Profile picture removed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
        setShowButton(false);
    };

    const promptForCredentials = () => {
        const email = currentUser.email;
        const password = prompt("To delete your account, enter password:");
        return EmailAuthProvider.credential(email, password);
    };

    const handleDelAccStart = async () => {
        try {
            setIsDeleting(true);
            if (currentUser.isAnonymous) {
                await deleteAcc();
            } else {
                const credential = promptForCredentials();
                await reauthenticateWithCredential(currentUser, credential);
                await deleteAcc();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setIsDeleting(false);
        }
    };

    const deleteAcc = async () => {
        setIsDeleting(true);
        try {
            // Delete profile picture if exists
            const fileRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');
            try {
                await getDownloadURL(fileRef);
                await deleteObject(fileRef);
            } catch (error) {
                if (error.code !== "storage/object-not-found") {
                    throw error;
                }
            }

            const docRef = doc(db, myCategory, currentUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                // Handle regular chat list (user-to-user or guest-to-user)
                const chatList = docSnap.data().chatList;
                if (chatList) {
                    await Promise.all(chatList.map(async (chatPartner) => {
                        const chatID = currentUser.uid < chatPartner ? 
                            currentUser.uid + "-" + chatPartner : 
                            chatPartner + "-" + currentUser.uid;
                        
                        // Remove current user from partner's list
                        await updateDoc(doc(db, "users", chatPartner), {
                            chatList: arrayRemove(currentUser.uid),
                            guestList: arrayRemove(currentUser.uid)
                        });
                        
                        // Delete chat document
                        await deleteDoc(doc(db, currentUser.isAnonymous ? "guestChats" : "chats", chatID));
                    }));
                }

                // Handle guest chat list
                const guestList = docSnap.data().guestList;
                if (guestList) {
                    await Promise.all(guestList.map(async (chatPartner) => {
                        const chatID = currentUser.uid < chatPartner ? 
                            currentUser.uid + "-" + chatPartner : 
                            chatPartner + "-" + currentUser.uid;
                        
                        // Remove current user from partner's list
                        await updateDoc(doc(db, "guests", chatPartner), {
                            chatList: arrayRemove(currentUser.uid),
                            guestList: arrayRemove(currentUser.uid)
                        });
                        
                        // Delete chat document
                        await deleteDoc(doc(db, "guestChats", chatID));
                    }));
                }

                // Delete user's document
                await deleteDoc(docRef);
            }

            await deleteUser(currentUser);
            toast({
                title: "Success",
                description: "Account deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            try {
                setIsLoggingOut(true);
                await signOut(auth);
                toast.success('Logged out successfully');
                navigate('/login');
            } catch (error) {
                console.error(error);
                toast.error('Error logging out');
                setIsLoggingOut(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="auth-card shadow-lg relative">
                <div className="flex w-full justify-start p-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigate("/")}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Back</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <CardContent className="mt-4 space-y-8 p-10">
                    <div className="relative w-full flex flex-col items-center">
                        <div className="relative">
                            <MyAvatar
                                width="200px"
                                height="200px"
                                src={currentUser.photoURL}
                                className={cn(
                                    "rounded-full",
                                    isUpdatingPP && "opacity-50"
                                )}
                            />
                            {isUpdatingPP && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-primary text-sm font-medium">
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                            )}
                            {/* Floating menu button - now top right of avatar */}
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-2 right-2 z-10 shadow-lg"
                                        aria-label="Profile picture options"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-40 p-2">
                                    <label htmlFor="ppUpload" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer">
                                        <ImagePlus className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Change picture</span>
                                        <input
                                            className="hidden"
                                            type="file"
                                            accept="image/*"
                                            id="ppUpload"
                                            onChange={handleEditPP}
                                        />
                                    </label>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex flex-nowrap items-center gap-2 w-full px-2 py-2 rounded hover:bg-accent text-destructive whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={currentUser.photoURL === DEFAULT_PHOTO_URL}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="text-sm whitespace-nowrap">Remove picture</span>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Remove profile picture?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to remove your profile picture? This action cannot be undone and your profile will revert to the default image.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleRemovePP}>
                                                Remove
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </PopoverContent>
                            </Popover>
                            {showCropper && selectedImage && (
                                <CropperModal
                                    image={selectedImage}
                                    onCancel={handleCropCancel}
                                    onCropComplete={handleCropComplete}
                                />
                            )}
                        </div>
                    </div>

                    <EditDisplayName label="Display Name" fbkey="displayName" />

                    <div className="rounded-lg bg-secondary p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1.5">
                                <p className="font-medium text-lg">Email</p>
                                <p className="text-sm text-muted-foreground">
                                    {currentUser.email}
                                </p>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>Edit disabled</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting || isLoggingOut}
                                    className="w-full"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <UserX className="mr-2 h-4 w-4" />
                                            Delete Account
                                        </>
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                        {currentUser.isAnonymous && (
                                            <p className="mt-2 font-medium text-destructive">
                                                Note: This is a temporary guest account.
                                            </p>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelAccStart}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete Account"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="secondary"
                                    disabled={isDeleting || isLoggingOut}
                                    className="w-full"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging out...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </>
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                                    {currentUser.isAnonymous && (
                                        <AlertDialogDescription>
                                            Since this is a temporary account, your account will be deleted if you log out.
                                        </AlertDialogDescription>
                                    )}
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Logging out...
                                            </>
                                        ) : (
                                            "Log Out"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;