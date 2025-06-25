import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import MyAvatar from './MyAvatar';
import { Card, CardContent } from "@/components/ui/card"
import { UserSearch } from "lucide-react"

const CACover = () => {
    const { currentUser } = useContext(AuthContext);
    
    return (
        <div className="flex h-full flex-col items-center justify-center bg-muted/50 p-8">
            <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center space-y-6 p-8">
                    <MyAvatar 
                        src={currentUser.photoURL} 
                        width="200px" 
                        height="200px" 
                    />
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl">
                            Hey <span className="font-bold text-primary">{currentUser.displayName}</span>!
                        </h2>
                        <div className="space-y-1 text-muted-foreground">
                            <p className="text-sm">
                                You can search for other people in the app to chat
                            </p>
                            <div className="flex items-center justify-center gap-2 text-xs">
                                <UserSearch className="h-4 w-4" />
                                <span>Just try it out using the search bar</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CACover;