import { RouterProvider } from 'react-router';
import { AppRouter } from '../config/AppRouter.config';

export const AppRouting = () => {
    return (
        <RouterProvider router={AppRouter}/>
    );
};
