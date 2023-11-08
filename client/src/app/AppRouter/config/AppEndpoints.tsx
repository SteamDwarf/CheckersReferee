import { DynamicAppRoutes, StaticAppRoutes } from "../types/enums";

export const AppEndpoints: Record<DynamicAppRoutes | StaticAppRoutes, string> = {
    [StaticAppRoutes.MAIN]: '/',
    [StaticAppRoutes.CREATE_TOURNAMENT]: '/create-tournament',
    [StaticAppRoutes.TOURNAMENTS]: '/tournaments',
    [DynamicAppRoutes.TOURNAMENT]: '/tournaments/:id',
    [StaticAppRoutes.CREATE_PLAYER]: '/create-player',
    [StaticAppRoutes.PLAYERS]: '/players',
    [DynamicAppRoutes.PLAYER]: '/players/:id',
    [StaticAppRoutes.OTHER]: '/*',
    [DynamicAppRoutes.TOURNAMENT_PLAYERS]: '/tournaments/:id/players',
    [DynamicAppRoutes.TOURNAMENT_TOURS]: '/tournaments/:id/tours',
    [DynamicAppRoutes.TOURNAMENT_TABLE]: '/tournaments/:id/table',
};