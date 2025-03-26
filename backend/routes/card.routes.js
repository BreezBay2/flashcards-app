import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createCard } from "../controllers/card.controller.js";

const router = express.Router();

router.post("/create/:id", protectRoute, createCard);

export default router;
