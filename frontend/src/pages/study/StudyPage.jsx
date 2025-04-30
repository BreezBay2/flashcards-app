import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import "../../styles/StudyPage.css";
import StudyCard from "../../components/StudyCard";
import Stopwatch from "../../components/Stopwatch";

const StudyPage = () => {
    const [answerShown, setAnswerShown] = useState(false);
    const [cardStack, setCardStack] = useState([]);

    const queryClient = useQueryClient();
    const cards = queryClient.getQueryData(["cards"]);

    const {
        mutate: updateCard,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ cardId, reviewCount, lastReview, nextReview }) => {
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
    }, []);

    useEffect(() => {
        console.log(cardStack);
    }, [cardStack]);

    const handleRepeatCard = () => {
        const card = cardStack[0];
        const cardId = card.id;
        const reviewCount = 0;
        const lastReview = card.lastReview;
        const nextReview = card.nextReview;

        setCardStack(cardStack.filter((_, index) => index !== 0));
        setCardStack((c) => [...c, card]);

        updateCard({ cardId, reviewCount, lastReview, nextReview });
    };

    const handleReviewCard = () => {
        const card = cardStack[0];
        const cardId = card.id;
        const reviewCount = card.reviewCount + 1;
        const lastReview = new Date();

        if (card.reviewCount < 7) {
            var nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + 1);
            updateCard({ cardId, reviewCount, lastReview, nextReview });
        } else {
            var nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + 7);
            updateCard({ cardId, reviewCount, lastReview, nextReview });
        }

        setCardStack(cardStack.filter((_, index) => index !== 0));
    };

    return (
        <div className="study-page">
            {cardStack.length > 0 && <Stopwatch />}
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
                                Repeat
                            </button>
                            <button
                                onClick={() => {
                                    setAnswerShown(false);
                                    handleReviewCard();
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <h1>You reviewed every card!</h1>
            )}

            {/* {cards.map((card) => (
                    <StudyCard key={card.id} card={card} />
                ))} */}
        </div>
    );
};

export default StudyPage;
