import { auth, db } from '../firebase';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const GuestLogIn = () => {
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const searchNames = [
        'g',    'gu',    'gue',
        'gues', 'guest', 'u',
        'ue',   'ues',   'uest',
        'e',    'es',    'est',
        's',    'st',    't'
    ];

    const handleGuestLogin = async () => {
        setIsLoadingGuest(true);
        try {
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;
            
            await updateProfile(user, {
                displayName: "Guest",
                photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
            });

            await setDoc(doc(db, "guests", user.uid), {
                isAnonymous: true,
                uid: user.uid,
                displayName: "Guest",
                photoURL: "https://firebasestorage.googleapis.com/v0/b/hotchat-nik.appspot.com/o/profilePics%2FDummy.png?alt=media&token=a39fc600-99f7-490d-a670-c23dc37e8d53",
                searchNames,
            });

            navigate("/");
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoadingGuest(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        or
                    </span>
                </div>
            </div>
            <Button
                variant="outline"
                className="w-full"
                onClick={handleGuestLogin}
                disabled={isLoadingGuest}
            >
                {isLoadingGuest ? "Logging in..." : "Guest Log in"}
            </Button>
        </div>
    );
};

export default GuestLogIn;
