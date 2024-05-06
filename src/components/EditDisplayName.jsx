import { useState, useRef, useEffect, useContext } from "react";
import Edit from "../assets/edit.png"
import Close from "../assets/close.png"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "firebase/auth"


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
            if (editedText === "") {
                alert("This field cannot be empty");
                return;
            }
            const docRef = doc(db, "users", currentUser.uid);
            const updateData = {};
            updateData["displayName"] = editedText;
            updateData["searchNames"] = getAllSubstrings(editedText);
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
        <div className="flex items-center justify-between w-[70%] p-2 h-[50px] gap-2">
            <p className="flex-shrink-0 inline-block whitespace-no-wrap text-[#ffffff] text-semibold">Display Name :</p>
            {!isEdit? <span className="text-[#86C232] text-bold">{currentUser["displayName"]}</span> : 
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
            <button onClick={handleClick}>
                <img src={!isEdit? Edit : Close} width={30} height={30} alt="edit" />
            </button>
        </div>
    )
}

export default EditDisplayName;