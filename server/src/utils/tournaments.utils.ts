import { ObjectId } from "mongodb";
import { getRandomItem } from "./math";
import { IPlayerDocument, IPlayerDocumentWithId } from "../models/players.model";
import { Game, IGameData, IGameDocument } from "../models/games.model";
import { getPlayerName } from "./player.utils";
import { collections, createDocument } from "../database/database";

const playerDummy = {
    _id: new ObjectId("000000000000000000000000"),
    firstName: "",
    lastName: "",
    middleName: ""
}
export const makeRoundRobinDraw = (playersIds: IPlayerDocumentWithId[]) => {
    const players = playersIds.length % 2 === 0 ? playersIds : [...playersIds, playerDummy];
    const toursCount = players.length - 1;
    const games: IGameDocument[] = [];

    for(let i = 0; i < toursCount; i++) {
        for (let j = 0; j < players.length / 2; j++) {
            const player1 = players[j];
            const player2 = players[players.length - 1 - j];
            const game = Game(
                            player1._id, 
                            getPlayerName(player1), 
                            player2._id, 
                            getPlayerName(player2)
                        );
            
            games.push(game);            
        }
        players.splice(1, 0, players[players.length - 1]);
        players.pop();
    }

    return games;
}