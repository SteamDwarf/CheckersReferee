import { ObjectId } from "mongodb";
import { getRandomItem } from "./math";
import { IPlayerDocument, IPlayerDocumentWithId } from "../models/players.model";
import { Game, IGameData } from "../models/games.model";
import { getPlayerName } from "./player.utils";

const playerDummy = {
    _id: "",
    firstName: "",
    lastName: "",
    middleName: ""
}
export const makeRoundRobinDraw = (playersIds: IPlayerDocumentWithId[]) => {
    const players = playersIds.length % 2 === 0 ? playersIds : [...playersIds, playerDummy];
    const toursCount = players.length - 1;
    const tours: IGameData[][] = [];

    for(let i = 0; i < toursCount; i++) {
        const games: IGameData[] = [];
        for (let j = 0; j < players.length / 2; j++) {
            const player1 = players[j];
            const player2 = players[players.length - 1 - j];
            const game = Game(player1._id.toString(), getPlayerName(player1), player2._id.toString(), getPlayerName(player2));

            games.push(game);
        }
        players.splice(1, 0, players[players.length - 1]);
        players.pop();
        tours.push(games);
    }

    return tours;
}