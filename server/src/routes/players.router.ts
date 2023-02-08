import express from "express";
import { createPlayer, deletePlayer, getPlayer, getPlayers, updatePlayer } from "../controllers/players.controller";

const router = express.Router();

router.route('/') 
    .get(getPlayers)
    .post(createPlayer);

router.route('/:id')
    .get(getPlayer)
    .put(updatePlayer)
    .delete(deletePlayer);

export default router;