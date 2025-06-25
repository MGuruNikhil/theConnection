import React, { useState } from 'react'
import { auth } from '../firebase.js'
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import GuestLogIn from '../components/GuestLogIn.jsx';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
    const navigate = useNavigate();
    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const email = e.target[0].value.trim();
        const password = e.target[1].value.trim();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setIsErr(false);
                const user = userCredential.user;
                if (user.emailVerified) {
                    navigate("/");
                } else {
                    toast({
                        title: "Email verification required",
                        description: "Please check your email and verify your account. Click 'Resend verification email' if you didn't receive it.",
                        variant: "destructive"
                    });
                    
                    // Show error with resend option
                    setIsErr(true);
                    setError(
                        <div className="flex flex-col gap-2">
                            <span>Email not verified. Please verify your email to login.</span>
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="w-fit"
                                onClick={async () => {
                                    try {
                                        await sendEmailVerification(user, {
                                            url: window.location.origin + "/login",
                                            handleCodeInApp: false,
                                        });
                                        toast({
                                            title: "Verification email sent",
                                            description: "Please check your email (including spam folder) for the verification link.",
                                        });
                                    } catch (err) {
                                        toast({
                                            title: "Error",
                                            description: err.message,
                                            variant: "destructive"
                                        });
                                    }
                                }}
                            >
                                Resend verification email
                            </Button>
                        </div>
                    );
                    
                    signOut(auth).catch((error) => {
                        console.error('Error during logout:', error);
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsErr(true);
                setError(error.message);
                setIsLoading(false);
            });
    }

    const handleForgotPasswordClick = () => {
        if (!resetEmail.trim()) {
            toast({
                title: "Error",
                description: "Please enter your email address",
                variant: "destructive"
            });
            return;
        }

        sendPasswordResetEmail(auth, resetEmail.trim())
            .then(() => {
                toast({
                    title: "Success",
                    description: "Password reset email has been sent",
                });
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive"
                });
            });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="auth-card shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">
                        <h1 className="text-4xl font-bold text-primary">theConnection</h1>
                        <h2 className="mt-2 text-2xl text-muted-foreground">Log in</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Enter email"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Enter password"
                            required
                        />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="link"
                                    className="px-0 font-normal"
                                >
                                    Forgot password?
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Reset Password</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                    />
                                    <Button onClick={handleForgotPasswordClick}>
                                        Send Reset Link
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Log in"}
                        </Button>
                        {isErr && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span>Don't have an account? </span>
                        <Link to="/signup" className="font-medium text-primary hover:underline">
                            Sign Up
                        </Link>
                    </div>
                    <div className="mt-4">
                        <GuestLogIn />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;