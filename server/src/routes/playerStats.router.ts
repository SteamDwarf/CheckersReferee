import express from "express";
import { getPlayerStatsByID, getPlayersStats } from "../controllers/playerStats.controller";

const router = express.Router();

router.route('/') 
    .get(getPlayersStats)

router.route('/:id')
    .get(getPlayerStatsByID)

export default router;