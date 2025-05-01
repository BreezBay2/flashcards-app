import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import "../../styles/StudyPage.css";
import StudyCard from "../../components/StudyCard";
import Stopwatch from "../../components/Stopwatch";
import {
    calculateEaseFactor,
    calculateInterval,
} from "../../utils/spacedRepetition";
import { isToday } from "../../utils/dateFormatter";

const StudyPage = () => {
    const queryClient = useQueryClient();
    const deck = queryClient.getQueryData(["deck"]);
    const repetitionType = deck.studyType;
    const cards = queryClient.getQueryData(["cards"]);

    const [answerShown, setAnswerShown] = useState(false);
    const [cardStack, setCardStack] = useState([]);

    const {
        mutate: updateCard,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({
            cardId,
            reviewCount,
            lastReview,
            nextReview,
            interval,
            easeFactor,
        }) => {
            try {
                const res = await fetch(`/api/cards/${cardId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reviewCount,
                        lastReview,
                        nextReview,
                        interval,
                        easeFactor,
                    }),
                });

                const data = res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error) {
                throw new Error();
            }
        },
    });

    useEffect(() => {
        cards.map((card) => {
            const currentDate = new Date().toISOString();
            if (card.nextReview < currentDate) {
                setCardStack((c) => [...c, card]);
            }
        });
        console.log(cards);
    }, []);

    useEffect(() => {
        console.log(cardStack);
    }, [cardStack]);

    const handleRepeatCard = () => {
        const card = cardStack[0];
        const cardId = card.id;

        switch (repetitionType) {
            case "No":
                setCardStack(cardStack.filter((_, index) => index !== 0));
                setCardStack((c) => [...c, card]);

                break;
            case "daily":
                setCardStack(cardStack.filter((_, index) => index !== 0));
                setCardStack((c) => [...c, card]);

                break;
            case "SRS":
                if (card.lastReview === null || isToday(card.lastReview)) {
                    // New card or already tried today
                    const lastReview = new Date();
                    card.lastReview = new Date();

                    updateCard({ cardId, lastReview });

                    setCardStack(cardStack.filter((_, index) => index !== 0));
                    setCardStack((c) => [...c, card]);

                    break;
                } else {
                    // 1st try today
                    const lastReview = new Date();
                    card.lastReview = new Date();
                    const reviewCount = 0;
                    const interval = calculateInterval(
                        reviewCount,
                        card.interval,
                        card.easeFactor
                    );
                    const easeFactor = calculateEaseFactor(
                        card.reviewCount,
                        card.easeFactor,
                        0
                    );

                    updateCard({
                        cardId,
                        reviewCount,
                        lastReview,
                        interval,
                        easeFactor,
                    });

                    setCardStack(cardStack.filter((_, index) => index !== 0));
                    setCardStack((c) => [...c, card]);

                    break;
                }
        }
    };

    const handleReviewCard = () => {
        const card = cardStack[0];
        const cardId = card.id;
        const lastReview = new Date();
        const currentDate = new Date();
        const reviewCount = card.reviewCount + 1;
        const easeFactor = calculateEaseFactor(
            card.reviewCount,
            card.easeFactor,
            5
        );

        switch (repetitionType) {
            case "No":
                setCardStack(cardStack.filter((_, index) => index !== 0));

                break;
            case "daily":
                const nextReview = new Date(
                    new Date().setDate(currentDate.getDate() + 1)
                );

                updateCard({ cardId, reviewCount, lastReview, nextReview });

                setCardStack(cardStack.filter((_, index) => index !== 0));

                break;
            case "SRS":
                if (card.lastReview !== null) {
                    if (isToday(card.lastReview)) {
                        // 2nd try or higher today
                        const nextReview = new Date(
                            new Date().setDate(currentDate.getDate() + 1)
                        );

                        updateCard({ cardId, nextReview });

                        setCardStack(
                            cardStack.filter((_, index) => index !== 0)
                        );

                        break;
                    } else {
                        // 1st try today
                        const interval = calculateInterval(
                            card.reviewCount,
                            card.interval,
                            card.easeFactor
                        );
                        const nextReview = new Date(
                            new Date().setDate(currentDate.getDate() + interval)
                        );

                        updateCard({
                            cardId,
                            reviewCount,
                            lastReview,
                            nextReview,
                            interval,
                            easeFactor,
                        });

                        setCardStack(
                            cardStack.filter((_, index) => index !== 0)
                        );

                        break;
                    }
                } else {
                    // New card
                    const interval = calculateInterval(
                        0,
                        card.interval,
                        card.easeFactor
                    );
                    const nextReview = new Date(
                        new Date().setDate(currentDate.getDate() + 1)
                    );

                    updateCard({
                        cardId,
                        reviewCount,
                        lastReview,
                        nextReview,
                        interval,
                        easeFactor,
                    });

                    setCardStack(cardStack.filter((_, index) => index !== 0));

                    break;
                }
        }
    };

    return (
        <div className="study-page">
            {cardStack.length > 0 && <Stopwatch />}
            {cardStack.length > 0 && <h1>Repetition Type: {repetitionType}</h1>}
            {cardStack.length > 0 ? (
                <div className="study-card">
                    <h1>{cardStack[0].frontText}</h1>
                    {answerShown && <div className="study-divider"></div>}
                    {answerShown && <h1>{cardStack[0].backText}</h1>}
                    {!answerShown && (
                        <button
                            className="show-answer-button"
                            onClick={() => setAnswerShown(true)}
                        >
                            Show Answer
                        </button>
                    )}
                    {answerShown && (
                        <div className="study-review-buttons">
                            <button
                                onClick={() => {
                                    setAnswerShown(false);
                                    handleRepeatCard();
                                }}
                            >
                                {isPending ? "..." : "Again"}
                            </button>
                            <button
                                onClick={() => {
                                    setAnswerShown(false);
                                    handleReviewCard();
                                }}
                            >
                                {isPending ? "..." : "Next"}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <h1>You reviewed every card!</h1>
            )}
            {isError && <h1>{error.message}</h1>}

            {/* {cards.map((card) => (
                    <StudyCard key={card.id} card={card} />
                ))} */}
        </div>
    );
};

export default StudyPage;
