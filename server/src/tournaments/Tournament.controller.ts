import { Request, Response } from "express";
import BaseController from "../common/Base.controller";
import ControllerRoute from "../common/ControllerRouter";
import TournamentService from "./Tournament.service";
import { inject, injectable } from "inversify";
import { SERVICES } from "../common/injectables.types";
import TournamentStartMiddleware from "./middleware/TournamentStart.middleware";
import TournamentFinishMiddleware from "./middleware/TournamentFinish.middleware";
import TournamentFinishTourMiddleware from "./middleware/TournamentFinishTour.middleware";
import ValidateMiddleware from "../common/Validate.middleware";
import TournamentCreateDTO from "./dtos/TournamentCreate.dto";
import TournamentUpdateDTO from "./dtos/TournamentUpdate.dto";

@injectable()
class TournamentController extends BaseController {
    private readonly _tournamentStartMiddleware: TournamentStartMiddleware;
    private readonly _tournamentFinishMiddleware: TournamentFinishMiddleware;
    private readonly _tournamentFinishTourMiddleware: TournamentFinishTourMiddleware;

    constructor(
        @inject(SERVICES.Tournament) private readonly _tournamentService: TournamentService
    ) {

        super();

        this._tournamentStartMiddleware = new TournamentStartMiddleware(this._tournamentService);
        this._tournamentFinishMiddleware = new TournamentFinishMiddleware(this._tournamentService);
        this._tournamentFinishTourMiddleware = new TournamentFinishTourMiddleware(this._tournamentService);

        this.initRoutes([
            new ControllerRoute('/','get', [], this.get),
            new ControllerRoute('/','post', 
                [ new ValidateMiddleware(TournamentCreateDTO)],
                this.create
            ),
            new ControllerRoute('/:id','get', [], this.getByID),
            new ControllerRoute('/:id','put', 
                [new ValidateMiddleware(TournamentUpdateDTO)], 
                this.update
            ),
            new ControllerRoute('/:id','delete', [], this.delete),
            new ControllerRoute('/start/:id','put', 
                [this._tournamentStartMiddleware],
                this.start
            ),
            new ControllerRoute('/finish/:id','put', 
                [this._tournamentFinishMiddleware],
                this.finishTournament
            ),
            new ControllerRoute('/finish-tour/:id','put', 
                [this._tournamentFinishTourMiddleware],
                this.finishTour
            ),
            new ControllerRoute('/restart/:id','put', 
                [],
                this.restart
            )
        ]);
    }

    private async get(request: Request, response: Response) {
        const page = request.query.page || "1";
        const limit = request.query.limit || "10";
        const tournaments = await this._tournamentService.getTournaments();
        const paginatedTournaments = this.paginateData(tournaments, +limit, +page);
        const tournamentsData = paginatedTournaments.map(tournament => tournament.data);

        response.setHeader("x-total-count", tournaments.length);
        response.json(tournamentsData);
    }
    private async getByID(request: Request, response: Response) {
        const {id} = request.params;
        const tournament = await this._tournamentService.getTournamentByID(id);
    
        response.json(tournament ? tournament.data : null);
    }

    private async create(request: Request, response: Response) {
        const tournamentDocument = await this._tournamentService.createTournament(request.body);
    
        response.status(201).json(tournamentDocument.data);
    }


    private async update(request: Request, response: Response) {
        const {id} = request.params;
        const updatedTournament = await this._tournamentService.updateTournament(id, request.body);

        response.json(updatedTournament.data);
    }
    private async delete(request: Request, response: Response) {
        const {id} = request.params;
        const deleteResult = await this._tournamentService.deleteTournament(id);

        response.json(deleteResult);
    }

    private async start(request: Request, response: Response) {
        const {id} = request.params;
        const startedTournament = await this._tournamentService.startTournament(id);

        response.json(startedTournament.data);
    }
    private async finishTournament(request: Request, response: Response) {
        const {id} = request.params;
        const updatedTournament = await this._tournamentService.finishTournament(id);

        response.json(updatedTournament.data);
    }
    private async finishTour(request: Request, response: Response) {
        const {id} = request.params;
        const tournament = await this._tournamentService.finishTour(id);

        response.json(tournament.data);
    }

    private async restart(request: Request, response: Response) {
        const {id} = request.params;
        const tournament = await this._tournamentService.restart(id);
        
        response.json(tournament.data);
    }
}

export default TournamentController;