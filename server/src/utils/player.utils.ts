import { ISportsCategory, ISportsCategoryWithID} from "../sportsCategory/sportsCategory.model"
import { clamp } from "./math";
import { IPlayerStats, IPlayerStatsWithID } from "../playerStats/playerStats.model";
import { IGame, IGameWithId } from "../games/games.model";

//TODO удалить

export const calculateAdamovichAfterGame = (playerStats: IPlayerStats, competitorAdamovichRank: number) => {
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

export const calculateGorinRank = (playerID: string, games: IGame[], playersStats: IPlayerStatsWithID[]) => {
    let winedScore = 0;
    let drawScore = 0;
    let looseScore = 0;
    let gorinCoefficient = 0;

    games.map(game => {
        const competitorID = game.player1StatsID === playerID ? game.player2StatsID : game.player1StatsID;
        const competitorStats = playersStats.find(stat => stat._id.toString() === competitorID);
        const playerScore = game.player1StatsID === playerID ? game.player1Score : game.player2Score;

        if(competitorStats) {
            if(playerScore === 2) {
                winedScore += competitorStats.score;
            } else if(playerScore === 1) {
                drawScore += competitorStats.score;
            } else {
                looseScore += competitorStats.score;
            }
        }
    });
    gorinCoefficient = winedScore * 4 + drawScore * 2 + looseScore;

    return gorinCoefficient;
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