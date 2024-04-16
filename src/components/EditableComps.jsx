import { useState } from "react";
import Edit from "../assets/edit.png"
import Close from "../assets/close.png"


const EditableComp = (props) => {

    const [isEdit, setIsEdit] = useState(false);


    return (
        <div className="flex items-center justify-between w-[70%] p-2 h-[50px] gap-2">
            <p className="flex-shrink-0 inline-block whitespace-no-wrap text-[#ffffff] text-semibold">{props.label} :</p>
            {!isEdit ? <span className="text-[#86C232] text-bold">{props.value}</span> : <input style={{ minWidth: '0' }} className="flex-grow rounded-md p-[2px] focus:outline-none focus:ring-2 focus:ring-[#86C232] h-[100%]" type="text" name={props.key} id={props.key} /> }
            <button onClick={() => {setIsEdit(prev=>!prev)}}>
                <img src={!isEdit ? Edit : Close} width={20} height={20} alt="edit" />
            </button>
        </div>
    )
}

export default EditableComp;