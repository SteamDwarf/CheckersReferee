import { createEntityAdapter } from "@reduxjs/toolkit";
import { ITournament } from "../types/interfaces";
import { compareByEndDate } from "../utils/comparators";

export const tournamentAdapter = createEntityAdapter<ITournament>({
    selectId: (tournament) => tournament._id,
    sortComparer: compareByEndDate
});


export const initialState = tournamentAdapter.getInitialState();
