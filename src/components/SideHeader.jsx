import React, { useContext } from 'react';
import { auth, db, storage } from '../firebase';
import { deleteUser, signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from "lucide-react";
import MyAvatar from './MyAvatar';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

const SideHeader = () => {
    const { currentUser } = useContext(AuthContext);
    const displayName = currentUser.displayName;
    const photoURL = currentUser.photoURL;
    const navigate = useNavigate();
    const { toast } = useToast();

    const deleteAnonAcc = async () => {
        try {
            // Handle profile picture deletion
            const fileRef = ref(storage, 'profilePics/' + currentUser.uid + '.jpg');
            try {
                await getDownloadURL(fileRef);
                await deleteObject(fileRef);
            } catch (error) {
                if (error.code !== "storage/object-not-found") {
                    console.error("Error handling profile picture:", error);
                }
            }

            // Handle chat data deletion
            const docRef = doc(db, "guests", currentUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // Handle user chats
                if (userData.chatList) {
                    for (const chatPartnerId of userData.chatList) {
                        const chatID = currentUser.uid < chatPartnerId 
                            ? currentUser.uid + "-" + chatPartnerId 
                            : chatPartnerId + "-" + currentUser.uid;
                        
                        await updateDoc(doc(db, "users", chatPartnerId), {
                            guestList: arrayRemove(currentUser.uid)
                        });
                        await deleteDoc(doc(db, "guestChats", chatID));
                    }
                }

                // Handle guest chats
                if (userData.guestList) {
                    for (const chatPartnerId of userData.guestList) {
                        const chatID = currentUser.uid < chatPartnerId 
                            ? currentUser.uid + "-" + chatPartnerId 
                            : chatPartnerId + "-" + currentUser.uid;
                        
                        await updateDoc(doc(db, "guests", chatPartnerId), {
                            guestList: arrayRemove(currentUser.uid)
                        });
                        await deleteDoc(doc(db, "guestChats", chatID));
                    }
                }

                await deleteDoc(docRef);
            }

            await deleteUser(currentUser);
            
            toast({
                title: "Success",
                description: "Guest account deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            console.error("Error deleting guest account:", error);
        }
    };

    const handleLogout = async () => {
        try {
            if (currentUser.isAnonymous) {
                await deleteAnonAcc();
            } else {
                await signOut(auth);
                toast({
                    title: "Success",
                    description: "Logged out successfully",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to log out. Please try again.",
                variant: "destructive",
            });
            console.error('Error during logout:', error);
        }
    };

    return (
        <header className="flex h-14 items-center justify-between border-b bg-gradient-to-r from-muted to-accent px-4 py-2">
            <div className="flex items-center gap-3">
                <MyAvatar 
                    src={photoURL} 
                    width="40px" 
                    height="40px" 
                />
                <span className="text-sm font-medium">
                    {displayName}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/profile")}
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Profile</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <AlertDialog>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Log out</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

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
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>
                                Log out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
    );
};

export default SideHeader;
