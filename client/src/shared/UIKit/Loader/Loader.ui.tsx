import { FC } from "react"
import styles from './Loader.module.css';

interface ILoaderProps {
    className?: string
}

export const Loader: FC<ILoaderProps> = ({className}) => {
    return (
        <div className={className}>
            <div className={styles['lds-roller']}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    );
}