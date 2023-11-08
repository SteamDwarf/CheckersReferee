import { EntityId } from "@reduxjs/toolkit";


export interface AppRouteProps {
    path: string,
    element: React.ReactNode | null,
    children?: AppRouteProps[]
}
export type LinkCreator = (id: string | EntityId) => string;