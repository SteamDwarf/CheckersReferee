import { ChangeEvent, FC, InputHTMLAttributes, PropsWithChildren, useState } from "react"
import { EditableField } from "../EditableField"
import { Input } from "shared/UIKit/Input"
import { LabeledField } from "shared/UIKit/LabeledField"
import { formatDate } from "shared/lib/dateFormater"


/* export const enum FieldTextType {
    text = 'text',
    title = 'title'
}

const getChildren = (value: string | number | undefined | readonly string[], type: FieldTextType) => {
    if(type === FieldTextType.text) return value;
    if(type === FieldTextType.title) return <h2>{value}</h2>
} */


interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (data: any) => void,
    //label?: string,
    //textType?: FieldTextType
}


export const InputField:FC<IInputFieldProps> = ({
    type, 
    value, 
    onSave, 
    children
    //label, 
    //textType=FieldTextType.text
}) => {
    const [tempValue, setTempValue] = useState(value)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTempValue(e.target.value)
    }

    const save = () => {
        onSave(tempValue)
    }

    /* const formatValue = (value: string) => {
        if(type === 'date') return formatDate(value);
        return value;
    } */

    return (
        <EditableField 
            onSave={save} 
            editComponent={
                <Input type={type} value={tempValue} onChange={onChange} />
            }
        >
            {children}
            {/* {
                label 
                    ? <LabeledField label={label}>{formatValue(value as string)}</LabeledField> 
                    : getChildren(formatValue(value as string), textType)
            } */}
        </EditableField>
    )    
}