import styles from './TournamentDetailsHeader.module.css';

import { DynamicAppLinks } from "app/AppRouter";
import { FC } from "react";
import { HeaderLink } from "shared/UIKit/HeaderLink";

interface ITournamentDetailsHeader {
    id: string
}

export const TournamentDetailsHeader:FC<ITournamentDetailsHeader> = ({id}) => {
    return (
        <nav className={styles.header}>
            <HeaderLink end to={DynamicAppLinks.tournament(id)}>Информация о турнире</HeaderLink>
            <HeaderLink end to={DynamicAppLinks.tournamentPlayers(id)}>Участники</HeaderLink>
            <HeaderLink end to={DynamicAppLinks.tournamentTours(id)}>Туры</HeaderLink>
            <HeaderLink end to={DynamicAppLinks.tournamentTable(id)}>Турнирная таблица</HeaderLink>
        </nav>
    );
}