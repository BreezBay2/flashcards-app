import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import "../../styles/StudyPage.css";
import StudyCard from "../../components/StudyCard";

const StudyPage = () => {
    const [cardIndex, setCardIndex] = useState(0);
    const [answerShown, setAnswerShown] = useState(false);

    const queryClient = useQueryClient();

    const cards = queryClient.getQueryData(["cards"]);

    const cardsDeck = [];

    cards.map((card) => {
        cardsDeck.push(card);
    });

    const animateAway = () => {
        cardIndex = cardIndex + 1;
        console.log(cardIndex);
    };

    return (
        <div className="study-page">
            <h1>We're going to study here</h1>
            {cardIndex < cardsDeck.length ? (
                <div className="study-card">
                    <h1>{cardsDeck[cardIndex].frontText}</h1>
                    {answerShown && <h1>{cardsDeck[cardIndex].backText}</h1>}
                    {!answerShown && (
                        <button onClick={() => setAnswerShown(true)}>
                            Show Answer
                        </button>
                    )}
                    {answerShown && (
                        <div className="study-review-buttons">
                            <button
                                onClick={() => {
                                    setCardIndex((cardIndex) => cardIndex + 1);
                                    setAnswerShown(false);
                                }}
                            >
                                Repeat
                            </button>
                            <button
                                onClick={() => {
                                    setCardIndex((cardIndex) => cardIndex + 1);
                                    setAnswerShown(false);
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
