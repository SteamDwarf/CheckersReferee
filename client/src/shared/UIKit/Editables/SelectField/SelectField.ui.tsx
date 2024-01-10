import { ChangeEvent, FC, PropsWithChildren, ReactNode, SelectHTMLAttributes, useState } from "react"
import { EditableField } from "../EditableField"
import { Select } from "shared/UIKit/Select"


interface ISelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement>, PropsWithChildren{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (data: any) => void,
    options: ReactNode
}


export const SelectField:FC<ISelectFieldProps> = ({
    value, 
    onSave, 
    children,
    options
}) => {
    const [tempValue, setTempValue] = useState(value)

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTempValue(e.target.value)
    }

    const save = () => {
        onSave(tempValue)
    }

    return (
        <EditableField 
            onSave={save} 
            editComponent={
                <Select onChange={onChange}>{options}</Select>
            }
        >
            {children}
        </EditableField>
    )    
}