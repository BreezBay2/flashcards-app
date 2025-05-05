import prisma from "../db/prisma.js";

export const createCard = async (req, res) => {
    try {
        const { frontText, backText } = req.body;
        const deckId = req.params.id;

        if (!frontText && !backText) {
            return res.status(400).json({ error: "Empty Card" });
        }

        const newCard = await prisma.card.create({
            data: {
                frontText,
                backText,
                deckId,
            },
        });

        if (newCard) {
            res.status(201).json({
                id: newCard.id,
                frontText: newCard.frontText,
                backText: newCard.backText,
                deckId: newCard.deckId,
            });
        } else {
            return res.status(400).json({ error: "Invalid Card Data" });
        }
    } catch (error) {
        console.log("Error occured while creating a card", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllCards = async (req, res) => {
    try {
        const deck = await prisma.deck.findUnique({
            where: { id: req.params.id },
        });

        if (deck.userId !== req.user.id) {
            return res.status(401).json({ error: "This is not your deck" });
        }

        const cards = await prisma.card.findMany({
            where: { deckId: req.params.id },
            orderBy: { nextReview: "asc" },
        });

        if (cards.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(cards);
    } catch (error) {
        console.log("Error occured while trying to get all cards");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateCard = async (req, res) => {
    try {
        const card = await prisma.card.findUnique({
            where: { id: req.params.id },
        });

        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }

        const deck = await prisma.deck.findUnique({
            where: { id: card.deckId },
        });

        if (deck.userId !== req.user.id) {
            return res
                .status(401)
                .json({ error: "You are not authorized to edit this card" });
        }

        await prisma.card.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.status(200).json(card);
    } catch (error) {
        console.log("Error occured while trying to edit card", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const card = await prisma.card.findUnique({
            where: { id: req.params.id },
        });

        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }

        const deck = await prisma.deck.findUnique({
            where: { id: card.deckId },
        });

        if (deck.userId !== req.user.id) {
            return res
                .status(401)
                .json({ error: "You are not authorized to delete this card" });
        }

        await prisma.card.delete({
            where: { id: req.params.id },
        });

        res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
        console.log("Error occured while deleting a card", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
