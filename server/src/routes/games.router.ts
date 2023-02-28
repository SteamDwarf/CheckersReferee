import express from "express";
import { getGame, getGames, updateGame } from "../controllers/games.controller";

const router = express.Router();

router.route("/")
    .get(getGames);

router.route('/:id')
    .get(getGame)
    .put(updateGame)

export default router;