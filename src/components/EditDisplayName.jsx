import { useState, useRef, useEffect, useContext } from "react";
import { Edit, X } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "firebase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

const EditDisplayName = () => {
    const { currentUser } = useContext(AuthContext);
    const myCategory = currentUser.isAnonymous ? 'guests' : 'users';
    const [isEdit, setIsEdit] = useState(false);
    const [editedText, setEditedText] = useState(currentUser["displayName"]);
    const inputRef = useRef(null);
    const { toast } = useToast();

    const handleClick = () => {
        setIsEdit(prev => !prev);
    };

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
        if (e.code === 'Enter') {
            const newName = editedText.trim();
            if (newName === "") {
                toast({
                    title: "Error",
                    description: "Display name cannot be empty",
                    variant: "destructive",
                });
                return;
            }

            try {
                const docRef = doc(db, myCategory, currentUser.uid);
                const updateData = {
                    displayName: newName,
                    searchNames: getAllSubstrings(newName),
                };

                await updateProfile(currentUser, { displayName: newName });
                await updateDoc(docRef, updateData);
                
                toast({
                    title: "Success",
                    description: "Display name updated successfully",
                });

                setIsEdit(false);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    };

    useEffect(() => {
        if (isEdit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEdit]);

    return (
        <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="font-medium">Display Name</p>
                    {!isEdit ? (
                        <p className="text-sm text-primary">
                            {currentUser["displayName"]}
                        </p>
                    ) : (
                        <Input
                            ref={inputRef}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            onKeyDown={handleSubmit}
                            className="h-8 w-[200px]"
                        />
                    )}
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClick}
                            >
                                {!isEdit ? (
                                    <Edit className="h-4 w-4" />
                                ) : (
                                    <X className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {!isEdit ? "Edit" : "Cancel"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default EditDisplayName;