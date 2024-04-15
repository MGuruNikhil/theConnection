import { useState } from "react";
import Edit from "../assets/edit.png"


const EditableComp = (props) => {

    const [isEdit, setIsEdit] = useState(false);


    return (
        <div className="flex justify-between w-[70%]">
            <div className="flex gap-2">
                <span className="text-[#ffffff] text-semibold">{props.label} :</span>
                {!isEdit ? <span className="text-[#86C232] text-bold">{props.value}</span> : <input type="text" name={props.key} id={props.key} /> }
            </div>
            <button>
                <img src={Edit} width={20} height={20} alt="edit" />
            </button>
        </div>
    )
}

export default EditableComp;