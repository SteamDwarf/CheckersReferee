import express from "express";
import { getGame, updateGame } from "../controllers/games.controller";

const router = express.Router();

router.route('/:id')
    .get(getGame)
    .put(updateGame)

export default router;