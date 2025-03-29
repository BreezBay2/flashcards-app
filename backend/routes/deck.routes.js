import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
    createDeck,
    deleteDeck,
    getAllDecks,
    getDeck,
    updateDeck,
} from "../controllers/deck.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllDecks);
router.get("/:id", protectRoute, getDeck);
router.post("/create", protectRoute, createDeck);
router.put("/:id", protectRoute, updateDeck);
router.delete("/:id", protectRoute, deleteDeck);

export default router;
