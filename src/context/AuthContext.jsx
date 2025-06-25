import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth state first
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        // Then listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed:", user ? user.email : "No user");
            
            if (user) {
                // Store minimal user info in localStorage
                const userToStore = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    isAnonymous: user.isAnonymous
                };
                localStorage.setItem('authUser', JSON.stringify(userToStore));
            } else {
                localStorage.removeItem('authUser');
            }
            
            setCurrentUser(user);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            localStorage.removeItem('authUser');
        };
    }, []);

    // Prevent rendering children until initial auth state is loaded
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};