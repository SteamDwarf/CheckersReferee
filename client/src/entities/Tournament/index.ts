
import { tournamentsApi } from './redux/tournament.api';
import { tournamentSlice } from './redux/tournament.slice';
export { type ITournament, type ITournamentsQueryParams } from './types/interfaces';
export { tournamentParamsSelect, tournamentSelect } from './redux/tournament.selectors';
export { TournamentBrief } from './ui/TournamentBrief/TournamentBrief.entity';
export { Tournament } from './ui/Tournament/Tournament.entity';
export { useTournament } from './hooks/useTournament.hook';

export { tournamentsApi };
export const {setLimit, setTournament} = tournamentSlice.actions;
export const { useGetTournamentsQuery, useGetTournamentByIdQuery } = tournamentsApi;



/* export const {
    selectAll: selectAllTournaments,
    selectById: selectTournamentById,
    selectIds: selectTournamentsIds,
} = tournamentSelectors; */