import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setTournament, useGetTournamentByIdQuery, useTournament } from "entities/Tournament";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useParams } from "react-router";
import { Error } from "shared/UIKit/Error";
import { Loader } from "shared/UIKit/Loader";
import { TournamentDetailsHeader } from "widgets/Tournament/TournamentDetailsHeader";

export const TournamentDetails = () => {
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const {data, isError, error, isLoading, isSuccess} = useGetTournamentByIdQuery(id || '');

    const setTournamentData =  () => {
        if(data) dispatch(setTournament(data))
    }

    useEffect(setTournamentData, [data]);

    if(isError) return <Error>{(error as FetchBaseQueryError).status}</Error>
    if(isLoading) return <Loader />

    return (
        <div>
            {id && <TournamentDetailsHeader id={id}/>}
            {isSuccess && <Outlet />}
        </div>
    );
}