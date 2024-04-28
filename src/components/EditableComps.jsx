import { useState, useRef, useEffect, useContext } from "react";
import Edit from "../assets/edit.png"
import Close from "../assets/close.png"
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "firebase/auth"
import { useNavigate } from "react-router-dom";


const EditableComp = (props) => {

    const { currentUser } = useContext(AuthContext);
    const [isEdit, setIsEdit] = useState(false);
    const [editedText, setEditedText] = useState((props.value != '-')?props.value:'');
    const inputRef = useRef(null);

    const handleClick = () => {
        setIsEdit(prev =>!prev);
    };

    const handleSubmit = async (e) => {
        if (e.code === 'Enter') {
            if (props.fbkey !== 'phoneNumber' && editedText === "") {
                alert("This field cannot be empty");
                return;
            }
            const docRef = doc(db, "users", currentUser.uid);
            const updateData = {};
            updateData[props.fbkey] = editedText;
            console.log(updateData);
            await updateProfile(currentUser, updateData);
            await updateDoc(docRef, updateData);
            window.location.reload();
        }
    };
    

    useEffect(() => {
        if (isEdit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEdit]);

    return (
        <div className="flex items-center justify-between w-[70%] p-2 h-[50px] gap-2">
            <p className="flex-shrink-0 inline-block whitespace-no-wrap text-[#ffffff] text-semibold">{props.label} :</p>
            {!isEdit? <span className="text-[#86C232] text-bold">{props.value}</span> : 
                <input 
                    ref={inputRef} 
                    style={{ minWidth: '0' }} 
                    onChange={(e)=>{setEditedText(e.target.value)}} 
                    value={editedText} 
                    className="flex-grow rounded-md p-[2px] focus:outline-none focus:ring-2 focus:ring-[#86C232] h-[100%]" 
                    type="text" 
                    name={props.fbkey} 
                    id={props.fbkey}
                    onKeyDown={handleSubmit}
                /> 
            }
            <button onClick={handleClick}>
                <img src={!isEdit? Edit : Close} width={20} height={20} alt="edit" />
            </button>
        </div>
    )
}

export default EditableComp;