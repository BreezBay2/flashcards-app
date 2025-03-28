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
        const cards = await prisma.card.findMany({
            where: { deckId: req.params.id },
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

export const deleteCard = async (req, res) => {};
