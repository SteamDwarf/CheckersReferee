import { useGetTournamentByIdQuery } from "..";
import { useState } from "react";

export const useTournament = (id: string) => {
    const {data, error, isError, isLoading, isSuccess} = useGetTournamentByIdQuery(id || '');

    const [tournament, setTournament] = useState(data);
    /* const {tournament, error, isError, isLoading} = useGetTournamentsQuery(tournamentParams, {
        selectFromResult: ({data, error, isError, isLoading}) => ({
            tournament : data?.find(t => t._id === id),
            error,
            isError,
            isLoading
        })
    }); */

    console.log("Start")

    return {tournament, setTournament, error, isError, isLoading, isSuccess};
}