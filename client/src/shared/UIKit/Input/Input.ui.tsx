import { FC, InputHTMLAttributes, memo} from "react";
import { classNames } from "shared/lib/classNames";
import styles from './Input.module.css';

export const Input:FC<InputHTMLAttributes<HTMLInputElement>> = memo(({className, ...props}) => {
    return (
        <input className={classNames(className, styles.input)} {...props} />
    );
})