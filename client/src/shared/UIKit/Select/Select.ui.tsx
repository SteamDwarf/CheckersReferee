import { FC, SelectHTMLAttributes, memo} from "react";
import { classNames } from "shared/lib/classNames";
import styles from './Select.module.css';

export const Select:FC<SelectHTMLAttributes<HTMLSelectElement>> = memo(({className, children, ...props}) => {
    return (
        <select
            className={classNames(className, styles.select)}
            {...props}
        >
            {children}
        </select>
    );
})