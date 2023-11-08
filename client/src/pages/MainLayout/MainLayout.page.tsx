import styles from './MainLayout.module.css';

import { Outlet } from "react-router";
import { Header } from "widgets/Header";

export const MainLayout = () => {
    return (
        <div>
            <Header />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}

