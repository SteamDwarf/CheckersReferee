import { AppRouting } from 'app/AppRouter/ui/AppRouting';
import styles from './App.module.css';
//import { BrowserRouter } from 'react-router-dom';

export const App = () => {
    return (
        <div className={styles.App}>
            <AppRouting />
        </div>
    )
}
