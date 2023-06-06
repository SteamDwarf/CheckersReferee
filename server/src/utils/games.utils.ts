import { IGameWithId } from "../games/games.model";
//TODO удалить
export const splitGames = (games: IGameWithId[], toursCount: number) => {
    const gamesInTour = games.length / toursCount;
    const tours: IGameWithId[][] = [];
    const toursGamesIDs: string[][] = [];

    for(let i = 0; i < toursCount; i++) {
        const tour: IGameWithId[] = [];
        const gamesIDs: string[] = [];

        for(let j = 0; j < gamesInTour; j++) {
            tour.push(games[j + i * gamesInTour]);
            gamesIDs.push(games[j + i * gamesInTour]._id.toString());
        }

        tours.push(tour);
        toursGamesIDs.push(gamesIDs);
    }

    return {tours, toursGamesIDs}
}