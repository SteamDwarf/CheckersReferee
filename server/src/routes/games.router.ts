import express from "express";
import { deleteGames, getGame, getGames, updateGame } from "../controllers/games.controller";

const router = express.Router();

//TODO удалить delete
router.route("/")
    .get(getGames)
    .delete(deleteGames);

router.route('/:id')
    .get(getGame)
    .put(updateGame)

export default router;