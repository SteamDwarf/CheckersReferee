import { ITournament, setTournament, tournamentSelect, useGetTournamentByIdQuery, useTournament } from "entities/Tournament";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TournamentInfoActions } from "widgets/Tournament/TournamentInfoActions";
import { TournamentInfoWidget } from "widgets/Tournament/TournamentInfoWidget";

export const TournamentInfoPage = () => {
    const dispatch = useDispatch();
    const tournament = useSelector(tournamentSelect);
    const setTournamentData = (tournamentData: ITournament) => {
        dispatch(setTournament(tournamentData))
    }

    return (
        <div>
            {tournament && <TournamentInfoWidget tournament={tournament} setTournament={setTournamentData}/>}
            <TournamentInfoActions />
        </div>
    );
}