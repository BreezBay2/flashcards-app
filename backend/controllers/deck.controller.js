import prisma from "../db/prisma.js";

export const createDeck = async (req, res) => {
    try {
        const { name, description, studyType } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!name || !studyType) {
            return res
                .status(400)
                .json({ error: "Required fields must be filled" });
        }

        const newDeck = await prisma.deck.create({
            data: {
                name,
                description,
                studyType,
                userId,
            },
        });

        if (newDeck) {
            res.status(201).json({
                id: newDeck.id,
                name: newDeck.name,
                description: newDeck.description,
                studyType: newDeck.studyType,
                userId: newDeck.userId,
            });
        } else {
            return res.status(400).json({ error: "Invalid Deck Data" });
        }
    } catch (error) {
        console.log("Error occured while creating a deck", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteDeck = async (req, res) => {
    try {
        const deck = await prisma.deck.findUnique({
            where: { id: req.params.id },
        });

        if (!deck) {
            return res.status(404).json({ error: "Deck not found" });
        }

        if (deck.userId !== req.user.id) {
            return res
                .status(401)
                .json({ error: "You are not authorized to delete this deck" });
        }

        await prisma.card.deleteMany({
            where: { deckId: req.params.id },
        });

        await prisma.deck.delete({
            where: { id: req.params.id },
        });

        res.status(200).json({ message: "Deck deleted successfully" });
    } catch (error) {
        console.log("Error occured while deleting a deck", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateDeck = async (req, res) => {
    try {
        const deck = await prisma.deck.findUnique({
            where: { id: req.params.id },
        });

        if (!deck) {
            return res.status(404).json({ error: "Deck not found" });
        }

        if (deck.userId !== req.user.id) {
            return res
                .status(401)
                .json({ error: "Your are not authorized to edit this deck" });
        }

        await prisma.deck.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.status(200).json(deck);
    } catch (error) {
        console.log("Error occured while updating a deck", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllDecks = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const decks = await prisma.deck.findMany({ where: { userId } });

        if (decks.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(decks);
    } catch (error) {
        console.log(
            "Error occured while trying to get all decks",
            error.message
        );
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getDeck = async (req, res) => {
    try {
        const deck = await prisma.deck.findUnique({
            where: { id: req.params.id },
        });

        if (!deck) {
            return res.status(404).json({ error: "Deck not found" });
        }

        if (deck.userId !== req.user.id) {
            return res
                .status(401)
                .json({ error: "This is not your deck, homie" });
        }

        res.status(200).json(deck);
    } catch (error) {
        console.log("Error occured trying to get a deck", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
