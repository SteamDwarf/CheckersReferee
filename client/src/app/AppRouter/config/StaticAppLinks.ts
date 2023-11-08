import { StaticAppRoutes } from "../types/enums";

export const StaticAppLinks: Record<StaticAppRoutes, string> = {
    [StaticAppRoutes.MAIN]: '/',
    [StaticAppRoutes.CREATE_TOURNAMENT]: '/create-tournament',
    [StaticAppRoutes.TOURNAMENTS]: '/tournaments',
    [StaticAppRoutes.CREATE_PLAYER]: '/create-player',
    [StaticAppRoutes.PLAYERS]: '/players',
    [StaticAppRoutes.OTHER]: '/*'
}
