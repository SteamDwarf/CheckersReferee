import { inject, injectable } from "inversify";
import BaseService from "../common/Base.service";
import { SERVICES } from "../common/injectables.types";
import SportsCategoryService from "../sportsCategory/SportsCategory.service";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import SportsCategoryDocument from "../sportsCategory/SportsCategoryDocument.entity";
import GameDocument from "../games/GameDocument.entity";
import { ISportsCategory } from "../sportsCategory/sportsCategory.model";
import { SportCategories, SportCategoriesAbbr } from "../common/enums";
import { SportsCategoryStatus } from "../players/players.model";
import { NotFoundError } from "../errors/NotFound.error";

@injectable()
class Calculations extends BaseService {
    constructor(
        @inject(SERVICES.SportsCategory) private readonly _sportsCategoryService: SportsCategoryService
    ) 
    {
        super();
    }

    public calculateAdamovichAfterGame(
        playerAdamovichRank: number,
        competitorAdamovichRank: number,
        gameScore: number
    ){
        const newRank = (20 * playerAdamovichRank + competitorAdamovichRank + 5000/15 * (gameScore - 1)) / 21;
        return newRank;
    }
    
    public calculateAdamovichAfterTournament (
        playerStats: PlayerStatsDocument, 
        sportsCategory: SportsCategoryDocument, 
        playersStats: PlayerStatsDocument[]
    )
    {
        let playedGames = 0;
    
        const constCoeff = this.getConstCoefficient(playerStats.age, sportsCategory);
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
    
        return newRank;
        //return this.clampAdamovichRank(sportsCategory, newRank);
    }
    
    public calculateGorinRank(playerID: string, games: GameDocument[], playersStats: PlayerStatsDocument[]){
        let winedScore = 0;
        let drawScore = 0;
        let looseScore = 0;
        let gorinCoefficient = 0;
    
        games.map(game => {
            const competitorID = game.player1StatsID === playerID ? game.player2StatsID : game.player1StatsID;
            const competitorStats = playersStats.find(stat => stat.id === competitorID);
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
    
    
    /* public clampAdamovichRank (sportCategory: SportsCategoryDocument, newRank: number) {
        return this._utils.clamp(newRank, sportCategory.minAdamovichRank, sportCategory.maxAdamovichRank);
    } */
    
    //TODO Заменить строку на enum
    public getConstCoefficient (age: number, sportsCategory: ISportsCategory){    
        if(sportsCategory.shortTitle == "БР" && age < 17) {
            return 5000/10;
        }
    
        return 5000/15;
    }


    public async calculateSportsCategory(
        playerStats: PlayerStatsDocument, 
        playersStats: PlayerStatsDocument[],
        toursCount: number
    ) {
        console.log("Calculate category======================");
        const currentCategory = await this._sportsCategoryService.getSportCategoryByID(playerStats.sportsCategoryID);
        if(!currentCategory) throw new NotFoundError("По указанному id не найден спортивный разряд");
        let newCategory = currentCategory;
        console.log(currentCategory.title);

        if(currentCategory.shortTitle === SportCategoriesAbbr.GR || 
            currentCategory.shortTitle === SportCategoriesAbbr.MS
        ) return;

        const competitors = playerStats.competitorsID.map(id => {
            return playersStats.find(stat => stat.id === id);
        })
        const categoryCoefficient = await this.calculateCategoryCoefficient(competitors);
        console.log("categoryCoefficient", categoryCoefficient);
        const tournamentCoeffficient = categoryCoefficient / toursCount;
        const requiredTournamentCoefficient = currentCategory.requiredTournamentCoefficient || 0;
        console.log("tournamentCoefficient", tournamentCoeffficient);

        if(currentCategory.shortTitle === SportCategoriesAbbr.UD ||
            requiredTournamentCoefficient < tournamentCoeffficient
        ) {
            const nearestCategory = await this._sportsCategoryService.getNearestCategory(tournamentCoeffficient);
            if(!nearestCategory) throw new NotFoundError("По указанному id не найден спортивный разряд");
            newCategory = nearestCategory;
            console.log("nearestCategory", newCategory);
        }
        
        await this.changeSportCategory(
            playerStats,
            currentCategory,
            newCategory,
            tournamentCoeffficient,
            competitors,
        );
    }

    private async changeSportCategory(
        playerStats: PlayerStatsDocument,
        currentCategory: SportsCategoryDocument, 
        newCategory: SportsCategoryDocument, 
        tournamentCoefficient: number,
        competitors: (PlayerStatsDocument | undefined)[],
    ) {
        console.log("\nchangeSportCategory", newCategory.title);
        console.log("name", playerStats.playerName);

        if(newCategory.shortTitle === SportCategoriesAbbr.UD) {
            //playerStats.newSportsCategoryStatus = SportsCategoryStatus.red;
            playerStats.setNewSportCategory(currentCategory, newCategory);
            console.log("this is undischarged");
            return;
        }
        console.log("category tfc", newCategory.requiredTournamentCoefficient);
        console.log("tfc", tournamentCoefficient);
        //TODO если не совпадают турнирные коэф находим подходящий
        //console.log("compare tfcs", currentCategory?.requiredTournamentCoefficient && 
        //tournamentCoefficient <= currentCategory?.requiredTournamentCoefficient);
        if(newCategory?.requiredTournamentCoefficient && 
            tournamentCoefficient <= newCategory?.requiredTournamentCoefficient
        ) {
            //console.log("all compared");
            const norm = await this.calculateCategoryNorm(newCategory, competitors);
            console.log("norm", norm);
            if(playerStats.normScore >= norm) {
                console.log("normScore", playerStats.normScore);
                console.log("playerStats.normScore >= norm", playerStats.normScore >= norm);
                //playerStats.newSportsCategoryStatus = SportsCategoryStatus.green;
                playerStats.setNewSportCategory(currentCategory, newCategory);
               /*  console.log(playerStats);
                console.log("\n"); */
                console.log("\n");
            } else {
                console.log("playerStats.score < norm");
                const prevCategory = await this._sportsCategoryService.getPrevCategory(newCategory.id);
                if(!prevCategory) return;

                await this.changeSportCategory(playerStats, currentCategory, prevCategory, tournamentCoefficient, competitors);
            }
        }
    }

    private async calculateCategoryCoefficient(competitors: (PlayerStatsDocument | undefined)[]) {
        const categoryCoefficient = await competitors.reduce(
            this.summingCategoryCoef.bind(this), 
            Promise.resolve(0)
        );

        return categoryCoefficient;
    }

    private async summingCategoryCoef(sum: Promise<number>, competitor: PlayerStatsDocument | undefined) {
        if(competitor) {
            const sportCategory = await this._sportsCategoryService.getSportCategoryByID(competitor.sportsCategoryID);
            const coef = await sum;
            return Promise.resolve(coef + (sportCategory?.categoryCoefficient || 0));
        }

        return sum;
    }

    private async calculateCategoryNorm(
        playerSportCategory: SportsCategoryDocument, 
        competitors: (PlayerStatsDocument | undefined)[]
    ) {
        const norm = await competitors.reduce(async (sum, competitor) => {
            return this.summinCategoryScore(sum, competitor, playerSportCategory);
        }, Promise.resolve(0));
        console.log("raw norm", norm);
        return this.round(norm) * 2;
    }

    private async summinCategoryScore(
        sum: Promise<number>, 
        competitor: PlayerStatsDocument | undefined,
        playerSportCategory: SportsCategoryDocument
    ) {
        if(!competitor) return sum;

        const score = await this._sportsCategoryService.getSportsCategoryScore(
            playerSportCategory,
            competitor?.sportsCategoryID
        );
        const sumScore = await sum;
        console.log("sumScore", sumScore);

        return Promise.resolve(sumScore + score);
    }

    private round(norm: number) {
        const integer = Math.floor(norm);
        const remainder = norm - integer;

        if(remainder >= 0 && remainder < 0.25) return Math.floor(norm);
        if(remainder >= 0.25 && remainder < 0.75) return integer + 0.5;
        return Math.ceil(norm);
    }
}

export default Calculations;