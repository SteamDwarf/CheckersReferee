import GameService from "../games/Games.service";
import GameDocument from "../games/GameDocument.entity";
import { IGame, IGameWithId } from "../games/games.model";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import { IPlayerStatsWithID } from "../playerStats/playerStats.model";
import Utils from "../utils/Utils";
import Draw from "./Draw";

class SwissDraw extends Draw {
    constructor(gameService: GameService, playerStatsService: PlayerStatsService, utils: Utils) {
        super(gameService, playerStatsService, utils);
    }

    public async makeStartDraw(tournamentID: string, playersStats: IPlayerStatsWithID[]) {
        const sortedPlayersStats = this.playerStatsService.getSortedPlayersStats(playersStats);
        const playersData = sortedPlayersStats.length % 2 === 0 ? [...sortedPlayersStats] : [...sortedPlayersStats, this.fakePlayer];
        
        const splitedPlayers = this.utils.splitArrayByItemsCount(playersData, 6).map(array => this.utils.splitArrayBySubArraysCount(array, 2));
        const games: GameDocument[] = [];
        //TODO при нечётном количестве в данном диапазоне игроков программа напоминает судье, что необходимо добавить 1 тур дополнительно
        const toursCount = this.getToursCount(playersStats.length);

        for(let i = 0; i < splitedPlayers.length; i++) {
            const group = splitedPlayers[i];
            for(let j = 0; j < group[0].length; j++) {
                const player1 = group[0][j];
                const player2 = group[1][j];
                const game = await this.makeGame(tournamentID, player1, player2);
            
                await this.playerStatsService.updateAfterDraw(player1, game.player1CheckersColor, player2._id.toString());
                await this.playerStatsService.updateAfterDraw(player2, game.player2CheckersColor, player1._id.toString());

                games.push(game);     
            }
            
        }

        return {games, toursCount};
    }

    public async makeDrawAfterTour(tournamentID: string, playersStats: IPlayerStatsWithID[]) {
        let sortedPlayers = this.playerStatsService.getSortedPlayersStats(playersStats);
        sortedPlayers = sortedPlayers.length % 2 === 0 ? [...sortedPlayers] : [...sortedPlayers, this.fakePlayer];

        this.fakePlayer.competitorsID = [];
        console.log(this.fakePlayer);

        const scoreGroups: IPlayerStatsWithID[][] = this.makeScoreGroups(sortedPlayers);
        const splitedScoreGroups = scoreGroups.map(scoreGroup => this.utils.splitArrayBySubArraysCount(scoreGroup, 2));
        const pairs = this.makeDraw(splitedScoreGroups);
        const games = [];

        for(const pair of pairs) {
            const game = await this.makeGame(tournamentID, pair[0], pair[1]);

            games.push(game);

            await this.playerStatsService.updateAfterDraw(pair[0], game.player1CheckersColor, pair[1]._id.toString());
            await this.playerStatsService.updateAfterDraw(pair[1], game.player2CheckersColor, pair[0]._id.toString());

            console.log(pair[0].playerName, "score:", pair[0].score);
            console.log(pair[1].playerName, "score", pair[1].score);
            console.log("==========================================");
        }

        return games;
    }

    private getToursCount (playersCount: number) {
        if(playersCount >= 11 && playersCount <= 20) return 7;
        if(playersCount >= 21 && playersCount <= 30) return 8;
        if(playersCount >= 31 && playersCount <= 40) return 9;
        if(playersCount >= 41 && playersCount <= 50) return 10;
        return 11;
    }

    private makeScoreGroups (sortedPlayers: IPlayerStatsWithID[]){
        const players = [...sortedPlayers];
        const scoreGroups = [];
    
        while(players.length > 0) {
            const player = players.shift();
    
            if(player && player._id !== this.fakePlayer._id) {
                const score = player.score;
                const scoreGroup: IPlayerStatsWithID[] = [player];
    
                while(players[0] && players[0].score === score) {
                    const otherPlayer = players.shift();
                    
                    if(otherPlayer) scoreGroup.push(otherPlayer);
                }
    
                scoreGroups.push(scoreGroup);
            } else if(player && player._id === this.fakePlayer._id) {
                scoreGroups[scoreGroups.length - 1].push(player);
            }
            
        }
    
        return this.disturbeGroups(scoreGroups);
    }

    private disturbeGroups (scoreGroups: IPlayerStatsWithID[][]){
        const disturbedScoreGroups: IPlayerStatsWithID[][] = [];
    
        scoreGroups.forEach((scoreGroup, i) => {
            if(scoreGroup.length % 2 !== 0 && i + 1 < scoreGroups.length) {
                const lastPlayer = scoreGroup.pop();
                if(lastPlayer) scoreGroups[i + 1].unshift(lastPlayer);
            }
    
            if(scoreGroup.length !== 0) {
                disturbedScoreGroups.push(scoreGroup);
            }
        });
    
        return disturbedScoreGroups;
    }
    
    private makeDraw (groups:IPlayerStatsWithID[][][]){
        let pairs = [];
        let unPairedPlayers = [];
    
        for(let i = 0; i < groups.length; i++) {
            const pairingResult = this.makePairs(groups[i]);
            
            pairs.push(...pairingResult.pairs);
    
            if(pairingResult.unPairedPlayers.length > 0 && i < groups.length - 1) {
                groups[i + 1][1].unshift(...pairingResult.unPairedPlayers);
            }
            else {
                unPairedPlayers.push(...pairingResult.unPairedPlayers);
            }
    
        }
        
        while(unPairedPlayers.length > 0) {
            unPairedPlayers = this.playerStatsService.getSortedPlayersStats(unPairedPlayers);
            pairs = this.utils.shuffle(pairs);
            
            const subGroup1 = unPairedPlayers.slice(0, Math.floor(unPairedPlayers.length / 2));
            const subGroup2 = unPairedPlayers.slice(Math.floor(unPairedPlayers.length / 2), unPairedPlayers.length);
            const pairingResult = this.makePairs([subGroup1, subGroup2], pairs);
    
            unPairedPlayers = [];
            pairs.push(...pairingResult.pairs);
            unPairedPlayers.push(...pairingResult.unPairedPlayers);
        }
    
        return pairs;
    }
    
    private makePairs(group: IPlayerStatsWithID[][], makedPairs?: IPlayerStatsWithID[][]) {
        let pairs: IPlayerStatsWithID[][] = [];
        const untouchablePairs: IPlayerStatsWithID[][] = []
        const unPairedPlayers = [];
        const subGroup1 = group[0];
        const subGroup2 = group[1];
        let unpairedPlayer: undefined | IPlayerStatsWithID = undefined;
    
    
        while(subGroup1.length > 0) {
            const player1: IPlayerStatsWithID | undefined = unpairedPlayer ? unpairedPlayer : subGroup1.shift();
            if(!player1) continue;
    
            const player2 = this.findCompetitor(player1, group);
            if(!player2) {
                const lastPair = pairs.length > 0 ? pairs.pop() : makedPairs?.pop();
    
                if(!lastPair) {
                    unPairedPlayers.push(player1);
                    unpairedPlayer = undefined;
                    continue;
                }
                
                lastPair[0].competitorsID.pop();
                lastPair[1].competitorsID.pop();
    
                unpairedPlayer = player1;
                subGroup1.unshift(lastPair[1]);
                subGroup2.unshift(lastPair[0]);
    
            } else {
                player1.competitorsID.push(player2._id.toString());
                player2.competitorsID.push(player1._id.toString());
                
                if(unPairedPlayers) {
                    untouchablePairs.push([player1, player2]);
                    unpairedPlayer = undefined;
                }
                else {
                    pairs.push([player1, player2]);
                }
    
            }
        }
    
        pairs = [...pairs, ...untouchablePairs];
        unPairedPlayers.push(...subGroup2);
    
        return {pairs, unPairedPlayers};
    
    }
    
    private findCompetitor (player1: IPlayerStatsWithID, group: IPlayerStatsWithID[][]){
        let subgroup = group[1];
        let competitor = this.searchInSubgroup(player1, subgroup);
    
        if(!competitor) {
            subgroup = group[0].reverse();
            competitor = this.searchInSubgroup(player1, subgroup);
        }
    
        return competitor;
    }
    
    private searchInSubgroup(player1: IPlayerStatsWithID, subgroup: IPlayerStatsWithID[]) {
        for(let i = 0; i < subgroup.length; i++) {
            const player2 = subgroup[i];
    
            if(!player1.competitorsID.includes(player2._id.toString()) || !player2.competitorsID.includes(player1._id.toString())) {
                subgroup.splice(subgroup.indexOf(player2), 1);
                return player2;
            }
        }
    }
}

export default SwissDraw;