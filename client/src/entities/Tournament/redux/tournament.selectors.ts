
//https://stackoverflow.com/questions/76212082/how-to-use-rtk-query-in-combination-with-selectors
//https://davy.ai/how-to-call-endpoint-select-in-rtk-query-with-an-argument-to-retrieve-cached-data-within-another-selector/
//https://github.com/reduxjs/redux-toolkit/discussions/3026
//https://stackoverflow.com/questions/76212082/how-to-use-rtk-query-in-combination-with-selectors

import { RootState} from "app/redux";
import { createSelector } from "reselect";

const tournamentStateSelect = (state: RootState) => state.tournament;

export const tournamentParamsSelect = createSelector(
    tournamentStateSelect,
    (stateData) => ({limit: stateData.limit, page: stateData.page})
)

/* export const tournamentParamsSelect = (state: RootState)  => {
    return {limit: state.tournament.limit, page: state.tournament.page}
}; */

export const tournamentSelect = createSelector(
    tournamentStateSelect,
    (stateData) => stateData.tournament
)

/* export const selectTournamentsResult = tournamentsApi.endpoints.getTournaments.select();
export const selectTournamentsData = createSelector(
    selectTournamentsResult,
    result => result.data
);

export const tournamentSelectors = tournamentAdapter.getSelectors((state: RootState) => {
    return selectTournamentsData(state) ?? initialState;
}); */


//Не рабочая попытка
/* export const selectTournamentsResult = (params: ITournamentsQueryParams) => {
    return (state: RootState) => tournamentsSlice.endpoints.getTournaments.select(params)(state);
} 

export const selectTournamentsData = (params: ITournamentsQueryParams) => createSelector(
    (state: RootState) => selectTournamentsResult(params)(state),
    result => result.data
); */
