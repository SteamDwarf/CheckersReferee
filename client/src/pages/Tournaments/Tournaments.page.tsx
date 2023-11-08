import styles from './Tournaments.module.css';

import { TournamentsList } from "widgets/Tournament/TournamentsList";

export const Tournaments = () => {
    return (
        <div className={styles.tournamentList}>
            <TournamentsList />
        </div>
    );
}