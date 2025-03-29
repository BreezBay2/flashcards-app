import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
    createCard,
    deleteCard,
    getAllCards,
} from "../controllers/card.controller.js";

const router = express.Router();

router.post("/create/:id", protectRoute, createCard);
router.get("/:id", protectRoute, getAllCards);
router.delete("/:id", protectRoute, deleteCard);

export default router;
