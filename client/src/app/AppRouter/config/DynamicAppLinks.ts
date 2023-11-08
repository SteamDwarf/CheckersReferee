import { DynamicAppRoutes } from "../types/enums";
import { LinkCreator } from "../types/types";

export const DynamicAppLinks: Record<DynamicAppRoutes, LinkCreator> = {
    [DynamicAppRoutes.TOURNAMENT]: (id) => `/tournaments/${id}`,
    [DynamicAppRoutes.TOURNAMENT_PLAYERS]: (id) => `/tournaments/${id}/players`,
    [DynamicAppRoutes.TOURNAMENT_TOURS]: (id) => `/tournaments/${id}/tours`,
    [DynamicAppRoutes.TOURNAMENT_TABLE]: (id) => `/tournaments/${id}/table`,
    [DynamicAppRoutes.PLAYER]: (id) => `/players/${id}`,
}