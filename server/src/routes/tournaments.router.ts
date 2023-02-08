import express from "express";
import { deleteTournament, finishTournament, getTournament, getTournaments, postTournament, startTournament, updateTournament } from "../controllers/tournament.controller";

const router = express.Router();

router.route('/') 
    .get(getTournaments)
    .post(postTournament);

router.route('/start/:id')
    .post(startTournament)

router.route('/finish/:id')
    .post(finishTournament)

router.route('/:id')
    .get(getTournament)
    .put(updateTournament)
    .delete(deleteTournament);

export default router;