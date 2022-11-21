import express from "express";
import { getSportCategoryById, getSportsCategories } from "../controllers/sportsCategories.controller";

const router = express.Router();

router.get('/', getSportsCategories);
router.get('/:id', getSportCategoryById);

export default router;