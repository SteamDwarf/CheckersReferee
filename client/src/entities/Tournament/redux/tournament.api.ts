import { ITournament, ITournamentsQueryParams } from "../types/interfaces";
import { apiSlice } from "app/redux";
import { compareByEndDate } from "../utils/comparators";




export const tournamentsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTournaments: builder.query<ITournament[], ITournamentsQueryParams>({
            query: (params) => {
                return {
                    url: '/tournaments',
                    params
                }
            },
            transformResponse: (tournaments: ITournament[] | []) => {
                return tournaments.sort(compareByEndDate);
            },
            providesTags: [{type: 'Tournament', id: 'LIST'}]
        }),
        getTournamentById: builder.query<ITournament, string>({
            query: (id) => `/tournaments/${id}`
        })
        /* getTournaments: builder.query<EntityState<ITournament>, void>({
            query: () => '/tournaments',
            transformResponse: (tournaments: ITournament[] | []) => {
                return tournamentAdapter.setAll(initialState, tournaments)
            },
            providesTags: [{type: 'Tournament', id: 'LIST'}]
        }), */
        /* getPostById: builder.query<EntityState<ITournament>, string>({
            query: id => `/tournaments/${id}`,
            transformResponse: (data: ITournament) => {
                return tournamentAdapter.addOne(initialState, data);
            },
        }), */
        /* getTournaments: builder.query<EntityState<ITournament>, ITournamentsQueryParams>({
            query: ({limit, page}) => {
                return {
                    url: '/tournaments',
                    params: {limit, page}
                }
            },
            transformResponse: (tournaments: ITournament[] | []) => {
                return tournamentAdapter.setAll(initialState, tournaments)
            },
            providesTags: [{type: 'Tournament', id: 'LIST'}]
        }), */
    })
})


/* const API_URL = '/tournaments';

export const getTournaments = createAsyncThunk('tournaments/getTournaments', async() => {
    const response = await fetch(`${BASE_URL}${API_URL}`);
    const data: ITournament[] | undefined = await response.json();

    return data;
});

export const tournamentsSlice = createSlice({
    name: 'tournaments',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getTournaments.pending, (state) => {
            state.status = FetchStatus.loading
        }),
        builder.addCase(getTournaments.fulfilled, (state, action) => {
            state.status = FetchStatus.succeeded;

            if(action.payload) {
                tournamentAdapter.setAll(state, action.payload);
            }
        })
        builder.addCase(getTournaments.rejected, (state, action) => {
            state.status = FetchStatus.failed;
            state.error = (action as PayloadAction<Error>).payload.message;
        })
    }
}) */
