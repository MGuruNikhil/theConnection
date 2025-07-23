import React, { useState } from 'react'
import CropperModal from '../components/CropperModal';
import { auth, storage, db } from '../firebase.js'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlus } from "lucide-react";
import GuestLogIn from '../components/GuestLogIn.jsx';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // base64 or url
    const [croppedBlob, setCroppedBlob] = useState(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    function getAllSubstrings(str) {
        const lowerCaseStr = str.toLowerCase();
        const result = [];
        for (let i = 0; i < lowerCaseStr.length; i++) {
            for (let j = i + 1; j <= lowerCaseStr.length; j++) {
                result.push(lowerCaseStr.substring(i, j));
            }
        }
        return result;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const displayName = e.target[0].value.trim();
        const email = e.target[1].value.trim();
        const password = e.target[2].value.trim();
        // Use croppedBlob if available, else file input
        const photo = croppedBlob || (e.target[3].files[0] || null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const searchNames = getAllSubstrings(displayName);

            let photoURL = "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53";

            if (photo) {
                const storageRef = ref(storage, 'profilePics/' + user.uid + '.jpg');
                const uploadTask = uploadBytesResumable(storageRef, photo);
                const snapshot = await uploadTask;
                photoURL = await getDownloadURL(snapshot.ref);
            }

            await updateProfile(user, {
                displayName,
                photoURL,
            });

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName,
                email,
                photoURL,
                searchNames,
            });

            await sendEmailVerification(auth.currentUser, {
                url: window.location.origin + "/login",
                handleCodeInApp: false,
            });
            
            toast({
                title: "Account created",
                description: "Please check your email (including spam folder) for the verification link. You must verify your email before logging in.",
            });
            
            // Sign out the user after registration so they must verify email first
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file input change to show cropper
    const handlePhotoChange = (e) => {
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
    const handleCropComplete = (blob) => {
        setCroppedBlob(blob);
        setShowCropper(false);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setSelectedImage(null);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="auth-card shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">
                        <h1 className="text-4xl font-bold text-primary">theConnection</h1>
                        <h2 className="mt-2 text-2xl text-muted-foreground">Sign Up</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Name</Label>
                            <Input
                                id="displayName"
                                type="text"
                                placeholder="Enter name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Set password"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profilePhoto" className="cursor-pointer inline-flex items-center gap-2 text-primary hover:text-primary/80">
                                <ImagePlus className="h-5 w-5" />
                                Add a profile pic
                            </Label>
                            <Input
                                id="profilePhoto"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                            {croppedBlob && (
                                <span className="text-xs text-green-600">Cropped image ready for upload</span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span>Already have an account? </span>
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Log In
                        </Link>
                    </div>
                    <div className="mt-4">
                        <GuestLogIn />
                    </div>
                </CardContent>
            </Card>
        {showCropper && selectedImage && (
            <CropperModal
                image={selectedImage}
                onCancel={handleCropCancel}
                onCropComplete={handleCropComplete}
            />
        )}
        </div>
    );
};

export default Signup;