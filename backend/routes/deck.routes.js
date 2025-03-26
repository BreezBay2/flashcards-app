import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
    createDeck,
    deleteDeck,
    getAllDecks,
} from "../controllers/deck.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllDecks);
router.post("/create", protectRoute, createDeck);
router.delete("/:id", protectRoute, deleteDeck);

export default router;
