import { useState, useRef, useEffect, useContext } from "react";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "firebase/auth"
import BootstrapTooltip from "../materialUI/BootstrapTooltip";


const EditDisplayName = () => {

    const { currentUser } = useContext(AuthContext);
    const [isEdit, setIsEdit] = useState(false);
    const [editedText, setEditedText] = useState(currentUser["displayName"]);
    const inputRef = useRef(null);

    const handleClick = () => {
        setIsEdit(prev =>!prev);
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
                alert("This field cannot be empty");
                return;
            }
            const docRef = doc(db, "users", currentUser.uid);
            const updateData = {};
            updateData["displayName"] = newName;
            updateData["searchNames"] = getAllSubstrings(newName);
            console.log(updateData);
            await updateProfile(currentUser, updateData);
            await updateDoc(docRef, updateData);
            setIsEdit(prev =>!prev);
        }
    };
    

    useEffect(() => {
        if (isEdit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEdit]);

    return (
        <div className="p-4 flex justify-between w-[70%] items-center rounded-xl bg-gradient-to-r from-[#004545] to-[#1f7474]">

            <div className="flex flex-col items-start">
                <p className="flex-shrink-0 inline-block whitespace-no-wrap text-[#ffffff] font-black">Display Name</p>
                {!isEdit? <span className="text-[#86C232] font-semibold">{currentUser["displayName"]}</span> : 
                    <input 
                        ref={inputRef} 
                        style={{ minWidth: '0' }} 
                        onChange={(e)=>{setEditedText(e.target.value)}} 
                        value={editedText} 
                        className="flex-grow rounded-md p-[2px] focus:outline-none focus:ring-2 focus:ring-[#86C232] h-[100%]" 
                        type="text" 
                        name="displayName"
                        id="displayName"
                        onKeyDown={handleSubmit}
                    /> 
                }
            </div>
            <button onClick={handleClick}>
                {!isEdit? <BootstrapTooltip title="edit"><EditIcon /></BootstrapTooltip> : <BootstrapTooltip title="cancle"><CloseIcon /></BootstrapTooltip>}
            </button>
        </div>
    )
}

export default EditDisplayName;