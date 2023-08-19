import GameService from "../games/Games.service";
import PlayerStatsService from "../playerStats/PlayerStats.service";
import Utils from "../utils/Utils";
import Draw from "./Draw";
import PlayerStatsDocument from "../playerStats/PlayerStatsDocument.entity";
import GamePlain from "../games/GamePlain.entity";
import TournamentDocument from "../tournaments/TournamentDocument.entity";
import { InputError } from "../errors/Input.error";

class SwissDraw extends Draw {
    constructor(gameService: GameService, playerStatsService: PlayerStatsService, utils: Utils) {
        super(utils);
    }

    public async makeStartDraw(tournament: TournamentDocument, sortedPlayersStats: PlayerStatsDocument[]) {
        const games: GamePlain[] = [];
        let playersData = [...sortedPlayersStats];

        if(sortedPlayersStats.length % 2 !== 0) {
            const {game, playersStats} = await this.excludeFreePlayer(playersData);

            if(game) games.push(game);
            playersData = playersStats;
        }
        
        const toursCount = tournament.toursCount || this.getToursCount(sortedPlayersStats.length);
        const splitedPlayers = this.utils.splitArrayByItemsCount(playersData, 6).map(array => this.utils.splitArrayBySubArraysCount(array, 2));

        for(let i = 0; i < splitedPlayers.length; i++) {
            const group = splitedPlayers[i];
            for(let j = 0; j < group[0].length; j++) {
                const player1 = group[0][j];
                const player2 = group[1][j];
                const game = await this.makeGame(tournament.id, player1, player2);
            
                player1.addCompetitor(player2.id);

                player2.addCompetitor(player1.id);

               /*  console.log(player1.playerName, player1.lastColor, player1.colorUsed);
                console.log(player2.playerName, player2.lastColor, player2.colorUsed);
                console.log("==========================================================") */

                games.push(game);     
            }
            
        }

        return {games, toursCount};
    }

    public async makeDrawAfterTour(tournamentID: string, sortedPlayersStats: PlayerStatsDocument[]) {
        const games: GamePlain[] = [];
        let playersData = [...sortedPlayersStats];

        if(sortedPlayersStats.length % 2 !== 0) {
            const {game, playersStats} = await this.excludeFreePlayer(playersData);

            if(game) games.push(game);
            playersData = playersStats;
        }

        const scoreGroups: PlayerStatsDocument[][] = this.makeScoreGroups(playersData);
        const splitedScoreGroups = scoreGroups.map(scoreGroup => this.utils.splitArrayBySubArraysCount(scoreGroup, 2));
        const pairs = this.makeDraw(splitedScoreGroups);

        for(const pair of pairs) {
            const game = await this.makeGame(tournamentID, pair[0], pair[1]);

            games.push(game);


            /* console.log(pair[0].playerName, pair[0].lastColor, pair[0].colorUsed);
            console.log(pair[1].playerName, pair[1].lastColor, pair[1].colorUsed);
            console.log(pair[0].playerName, "score:", pair[0].score);
            console.log(pair[1].playerName, "score", pair[1].score);
            console.log("=========================================="); */
        }

        return games;
    }

    private async excludeFreePlayer(sortedPlayersStats: PlayerStatsDocument[]) {
        for(let i = sortedPlayersStats.length - 1; i >= 0; i-- ) {
            const player = sortedPlayersStats[i];

            if(!player.competitorsID.includes(this.fakePlayer.id)) {
                const game = await this.makeGame(player.tournamentID, this.fakePlayer, player);
                let playersStats = [...sortedPlayersStats];

                player.addCompetitor(this.fakePlayer.id);
                playersStats = playersStats.filter(p => p.id !== player.id);

                return {game, playersStats};
            }
        }

        return {game: undefined, playersStats: sortedPlayersStats}
    }

    private getToursCount (playersCount: number) {
        if(playersCount >= 11 && playersCount <= 20) {
            if(playersCount % 2 === 0) return 7;
            return 8;
        }
        if(playersCount >= 21 && playersCount <= 30) return 8;
        if(playersCount >= 31 && playersCount <= 40) return 9;
        if(playersCount >= 41 && playersCount <= 50) return 10;
        return 11;
    }

    private makeScoreGroups (sortedPlayers: PlayerStatsDocument[]){
        const players = [...sortedPlayers];
        const scoreGroups = [];
    
        while(players.length > 0) {
            const player = players.shift();
    
            if(player && player.id !== this.fakePlayer.id) {
                const score = player.score;
                const scoreGroup: PlayerStatsDocument[] = [player];
    
                while(players[0] && players[0].score === score) {
                    const otherPlayer = players.shift();
                    
                    if(otherPlayer) scoreGroup.push(otherPlayer);
                }
    
                scoreGroups.push(scoreGroup);
            } else if(player && player.id === this.fakePlayer.id) {
                scoreGroups[scoreGroups.length - 1].push(player);
            }
            
        }
    
        return this.disturbeGroups(scoreGroups);
    }

    private disturbeGroups (scoreGroups: PlayerStatsDocument[][]){
        const disturbedScoreGroups: PlayerStatsDocument[][] = [];
    
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
    
    private makeDraw (groups:PlayerStatsDocument[][][]){
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
            //unPairedPlayers = this.playerStatsService.getSortedPlayersStats(unPairedPlayers);
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
    
    private makePairs(group: PlayerStatsDocument[][], makedPairs?: PlayerStatsDocument[][]) {
        let pairs: PlayerStatsDocument[][] = [];
        const untouchablePairs: PlayerStatsDocument[][] = []
        const unPairedPlayers = [];
        const subGroup1 = group[0];
        const subGroup2 = group[1];

        let unpairedPlayer: undefined | PlayerStatsDocument = undefined;
        let count = 0;
    
    
        while(subGroup1.length > 0) {
            const player1: PlayerStatsDocument | undefined = unpairedPlayer ? unpairedPlayer : subGroup1.shift();
            if(!player1) continue;

            count++;
            if(count > 10) throw new InputError("Не удалось подобрать соперников!");
    
            const player2 = this.findCompetitor(player1, group);
            if(!player2) {
                const lastPair = pairs.length > 0 ? pairs.pop() : makedPairs?.pop();
    
                if(!lastPair) {
                    unPairedPlayers.push(player1);
                    unpairedPlayer = undefined;
                    continue;
                }
                
                lastPair[0].popCompetitor();
                lastPair[1].popCompetitor();
    
                unpairedPlayer = player1;
                subGroup1.unshift(lastPair[1]);
                subGroup2.unshift(lastPair[0]);
    
            } else {
                player1.addCompetitor(player2.id);
                player2.addCompetitor(player1.id);
                
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
    
    private findCompetitor (player1: PlayerStatsDocument, group: PlayerStatsDocument[][]){
        let subgroup = group[1];
        let competitor = this.searchInSubgroup(player1, subgroup);
    
        if(!competitor) {
            subgroup = group[0].reverse();
            competitor = this.searchInSubgroup(player1, subgroup);
        }
    
        return competitor;
    }
    
    private searchInSubgroup(player1: PlayerStatsDocument, subgroup: PlayerStatsDocument[]) {
        for(let i = 0; i < subgroup.length; i++) {
            const player2 = subgroup[i];
    
            if(
                !player1.competitorsID.includes(player2.id.toString()) || 
                !player2.competitorsID.includes(player1.id.toString())
            ) {
                subgroup.splice(subgroup.indexOf(player2), 1);
                return player2;
            }
        }
    }
}

export default SwissDraw;