import { TournamentSystems } from "entities/Tournament/types/enums";
import { FC, PropsWithChildren, ReactNode, SelectHTMLAttributes, useCallback } from "react";
import { SelectField } from "shared/UIKit/Editables/SelectField";

interface ITournamentSystemFieldProps extends PropsWithChildren {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (data: any) => void,
    value: string | number | readonly string[] | undefined
}

export const TournamentSystemField:FC<ITournamentSystemFieldProps> = ({
    onSave,
    children,
    value
}) => {

    const options = useCallback(() => {
        return Object.values(TournamentSystems).map(v => {
            return <option key={v} value={v}>{v}</option>
        })
    }, [])

    return (
        <SelectField 
            value={value}
            onSave={onSave} 
            options={options()}
        >
            {children}
        </SelectField>  
    );
}