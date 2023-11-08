import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ITournament } from "..";

interface ITournamentState {
    page: number,
    limit: number,
    tournament: ITournament | null
}

const initialState: ITournamentState = {
    page: 1,
    limit: 10,
    tournament: null
}

export const tournamentSlice = createSlice({
    name: 'tournament',
    initialState,
    reducers: {
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload
        },
        setTournament: (state, action: PayloadAction<ITournament>) => {
            state.tournament = action.payload
        }
    }
});



/*

export const tournamentsSlice = createSlice({
    name: 'tournament',
    initialState: initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload
        }
    }
}); */
