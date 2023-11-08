import { FC } from "react"
import { formatDate } from "shared/lib/dateFormater";

interface IDatePeriodProps {
    className?: string,
    startDate?: string,
    endDate?: string
}

export const DatePeriod:FC<IDatePeriodProps> = ({className, startDate, endDate}) => {

    const content = () => {
        if(!startDate && !endDate) return "Даты не указаны";
        
        return (
            <>
                {startDate && <span>С {formatDate(startDate)}</span>}
                {endDate && <span> по {formatDate(endDate)}</span>}
            </>
        );
    }
    
    return (
        <span className={className}>
            {content()}
        </span>
    );
}