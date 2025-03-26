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

export const getAllCards = async (req, res) => {};

export const deleteCard = async (req, res) => {};
