import DataBase from "../DB/DataBase";
import BaseService from "../common/Base.service";
import { NotFoundError } from "../errors/NotFound.error";
import { ITournament, ITournamentWithId } from "../models/tournaments.model";

class TournamentService extends BaseService {
    constructor(db: DataBase) {
        super(db);
    }

    public async getTournaments (page: number, limit: number){
        const tournaments = await this.db.findDocuments(this.db.collections.tournaments) as ITournamentWithId[];
    
        return this.paginateData(tournaments || [], limit, page);
    }

    public async getTournamentByID(id:  string) {
        return await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    }

    //TODO разобраться с tournamentData
    
    public async postTournament(mainData: any){
        const tournamentData: ITournament = {
            ...mainData,
            isStarted: false,
            isFinished: false,
            referees: [],
            playersIDs: mainData.playersIDs || [],
            gamesIDs: mainData.gamesIDs || [],
            playersStatsIDs: []
        };
    
        return await this.db.createDocument(this.db.collections.tournaments, tournamentData) as ITournamentWithId;
    }

    public async deleteTournament (id: string){
        const tournamentForDeleting = await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    
        if(!tournamentForDeleting) throw new NotFoundError("По указанному id турнир не найден");
    
        return await this.db.deleteDocument(this.db.collections.tournaments, id);
    }

    public async updateTournament (id: string, newData: ITournament) {
        const documentForUpdate = await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId;
    
        if(!documentForUpdate) throw new NotFoundError("По указанному id турнир не найден");
    
        return await this.db.updateDocument(this.db.collections.tournaments, id, newData) as ITournamentWithId;
    }
}

export default TournamentService;



