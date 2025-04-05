import React from "react";

const StudyCard = ({ card }) => {
    return (
        <div className="study-card">
            <h1>{card.frontText}</h1>
            <h1>{card.backText}</h1>
            <button>Next</button>
        </div>
    );
};

export default StudyCard;
