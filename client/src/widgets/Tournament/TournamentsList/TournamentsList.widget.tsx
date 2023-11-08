import styles from './TournamentsList.module.css';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ITournament, tournamentParamsSelect, useGetTournamentsQuery } from "entities/Tournament";
import { FC, useCallback } from "react";
import { useSelector } from 'react-redux';
import { Error } from "shared/UIKit/Error";
import { Loader } from "shared/UIKit/Loader";
import { classNames } from 'shared/lib/classNames';
import { TournamentBriefWidget } from "widgets/Tournament/TournamentBrief";

interface ITournamentsListProps {
    className?: string
}

const emptyArray: ITournament[] = [];

export const TournamentsList:FC<ITournamentsListProps> = ({className}) => {
    const tournamentParams = useSelector(tournamentParamsSelect);
    const {data = emptyArray, isError, error, isFetching, isSuccess} = useGetTournamentsQuery(tournamentParams);


    const content = useCallback(() => {
        if(isFetching) return <Loader />
        if(isError) return <Error>{(error as FetchBaseQueryError).status}</Error>
        if(data.length === 0 && isSuccess) return <h2>Турниры не найдены</h2>

        return (
            <div className={styles.tournamentsList}>
                {data.map(tournament => {
                    return (
                        <div key={tournament._id}>
                            <TournamentBriefWidget tournamentId={tournament._id}/>
                        </div>
                    )
                })}
            </div>
        )
    }, [isError, error, isFetching, isSuccess, data]);

    return (
        <div className={classNames(styles.container, className)}>
            {content()}
        </div>
    );
}