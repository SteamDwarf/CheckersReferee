import { ITournament } from "entities/Tournament";
import { FC } from "react";
//import styles from './Tournament.module.css';

interface ITournamentProps {
    className?: string,
    tournament: ITournament
}

export const Tournament:FC<ITournamentProps> = ({tournament}) => {
    return (
        <div>
            <h2>{tournament.title}</h2>
        </div>
    );
}