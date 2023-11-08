import { App } from 'app/App';
import './index.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'app/redux';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
)
/* root.render(
    <AppProvider>
        <IconContext.Provider value={{color: "#3b5998", size: "18px"}}>
            <NotificationProvider>
                <App />
            </NotificationProvider>
        </IconContext.Provider>
    </AppProvider>
    
);
 */