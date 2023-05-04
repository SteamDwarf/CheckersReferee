import { IPlayerStats } from "../models/playerStats.model";

export const compareByScore = (player1: IPlayerStats, player2: IPlayerStats) => {
    if(player1.score > player2.score) return -1;
    if(player1.score < player2.score) return 1;
    return compareByGorinRank(player1, player2);
}

export const compareByGorinRank = (player1: IPlayerStats, player2: IPlayerStats) => {
    if(player1.gorinRank > player2.gorinRank) return -1;
    if(player1.gorinRank < player2.gorinRank) return 1;
    return compareByAdamovichRank(player1, player2);
}

export const compareByAdamovichRank = (player1: IPlayerStats, player2: IPlayerStats) => {
    if(player1.lastAdamovichRank > player2.lastAdamovichRank) return -1;
    if(player1.lastAdamovichRank < player2.lastAdamovichRank) return 1;
    return compareByBirthday(player1, player2);
}

export const compareByBirthday = (player1: IPlayerStats, player2: IPlayerStats) => {
    if(new Date(player1.birthday) > new Date(player2.birthday)) return -1;
    if(new Date(player1.birthday) < new Date(player2.birthday)) return 1;
    return compareByPlayerName(player1, player2);
}

export const compareByPlayerName = (player1: IPlayerStats, player2: IPlayerStats) => {
    if(player1.playerName > player2.playerName) return 1;
    if(player1.playerName < player2.playerName) return -1;
    return 0;
}

