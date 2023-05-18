import express from "express";
import { deleteTournament, finishTour, finishTournament, getTournament, getTournaments, postTournament, startTournament, updateTournament } from "../controllers/tournament.controller";

const router = express.Router();

router.route('/') 
    .get(getTournaments)
    .post(postTournament);

router.route('/start/:id')
    .put(startTournament);

router.route('/finish/:id')
    .put(finishTournament);

router.route('/finish-tour/:id')
    .put(finishTour);

router.route('/:id')
    .get(getTournament)
    .put(updateTournament)
    .delete(deleteTournament);

export default router;