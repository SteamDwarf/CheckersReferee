import express from "express";
import { deletePlayersStats, getPlayerStatsByID, getPlayersStats } from "../controllers/playerStats.controller";

const router = express.Router();

//TODO удалить delete
router.route('/') 
    .get(getPlayersStats)
    .delete(deletePlayersStats);

router.route('/:id')
    .get(getPlayerStatsByID)

export default router;