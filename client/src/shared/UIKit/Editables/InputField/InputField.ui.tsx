import { ChangeEvent, FC, InputHTMLAttributes, PropsWithChildren, useState } from "react"
import { EditableField } from "../EditableField"
import { Input } from "shared/UIKit/Input"

interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (data: any) => void
}

export const InputField:FC<IInputFieldProps> = ({children, type, value, onSave}) => {
    const [tempValue, setTempValue] = useState(value)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTempValue(e.target.value)
    }

    const save = () => {
        onSave(tempValue)
    }


    return (
        <EditableField 
            onSave={save} 
            editComponent={
                <Input type={type} value={tempValue} onChange={onChange} />
            }
        >
            {children}
        </EditableField>
    )    
}