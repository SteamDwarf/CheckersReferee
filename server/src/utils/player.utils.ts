import { ISportsCategory, ISportsCategoryWithID} from "../models/sportsCategory.model"
import { clamp } from "./math";
import { IPlayerStats } from "../models/playerStats.model";


export const calculateAdamovichAfterGame = (playerStats: IPlayerStats, competitorAdamovichRank: number) => {
    /* const sumCompetitorsRank = playersStats.reduce((sum, curPlayerStats) => {
        if(playerStats.playerID !== curPlayerStats.playerID) {
            return sum += curPlayerStats.startAdamovichRank;
        }

        return sum;
    }, 0); */
    //TODO брать startAdamovichRank или lastAdamovichRank
    const newRank = (20 * playerStats.startAdamovichRank + competitorAdamovichRank + 5000/15 * (playerStats.score - 1)) / 21;

    return newRank;
}

export const calculateAdamovichAfterTournament = (playerStats: IPlayerStats, sportsCategory: ISportsCategory, playersStats: IPlayerStats[]) => {
    let playedGames = 0;

    const constCoeff = getConstCoefficient(playerStats.birthday, sportsCategory);
    const sumCompetitorsRank = playersStats.reduce((sum, curPlayerStats) => {
        if(playerStats.playerID !== curPlayerStats.playerID && 
            Math.abs(playerStats.startAdamovichRank - curPlayerStats.startAdamovichRank) < 400
        ) {
            playedGames += 1;
            return sum += curPlayerStats.startAdamovichRank;
        }

        return sum;
    }, 0);

    const newRank = (20 * playerStats.startAdamovichRank + sumCompetitorsRank + constCoeff * (playerStats.score - playedGames)) / (20 + playedGames);

    //return newRank;
    return clampAdamovichRank(sportsCategory, newRank);
}


export const clampAdamovichRank = (sportCategory: ISportsCategory, newRank: number) => {
    return clamp(newRank, sportCategory.minAdamovichRank, sportCategory.maxAdamovichRank);
}

export const getPlayerName = (player: {firstName: string, middleName: string, lastName: string}) => {
    return [player.firstName, player.middleName, player.lastName].join(" ").trim();
}

const getConstCoefficient = (birthdayString: string, sportsCategory: ISportsCategory) => {
    const age = countAge(birthdayString);

    if(sportsCategory.shortTitle == "БР" && age < 17) {
        return 5000/10;
    }

    return 5000/15;
}

const countAge = (birthdayString: string) => {
    const today = new Date();
    const birthdayDate = new Date(birthdayString);
    const monthDiff = today.getMonth() - birthdayDate.getMonth();

    let age = today.getFullYear() - birthdayDate.getFullYear();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
        age--;
    }

    return age;
}