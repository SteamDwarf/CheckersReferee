import { combineReducers } from "redux";
import { apiSlice } from "./api";
import { tournamentSlice } from "entities/Tournament/redux/tournament.slice";

export const rootReducer = combineReducers({
    [tournamentSlice.name]: tournamentSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
})