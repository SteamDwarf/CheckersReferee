import { inject } from "inversify";
import BaseRepository from "../common/Base.repository";
import { MAIN } from "../common/injectables.types";
import DataBase from "../DB/DataBase";
import TournamentPlain from "./TournamentPlain.entity";
import { ITournamentWithId } from "./tournaments.model";
import TournamentUpdateDTO from "./dtos/TournamentUpdate.dto";

class TournamentRepository extends BaseRepository{
    constructor(
        @inject(MAIN.Database) database: DataBase
    ){
        super(database);
    }

    public async createTournament(tournamentData: TournamentPlain) {
        return await this.db.createDocument(this.db.collections.tournaments, tournamentData) as ITournamentWithId;
    }

    public async getAllTournaments() {
        return await this.db.findDocuments(this.db.collections.tournaments) as ITournamentWithId[];
    }

    public async getTournamentByID(id: string) {
        return await this.db.findDocumentById(this.db.collections.tournaments, id) as ITournamentWithId | undefined;
    }

    public async updateTournament(id: string, tournamentData: TournamentUpdateDTO) {
        return await this.db.updateDocument(this.db.collections.tournaments, id, tournamentData) as ITournamentWithId;
    }

    public async deleteTournament(id: string) {
        return await this.db.deleteDocument(this.db.collections.tournaments, id);
    }
}

export default TournamentRepository;