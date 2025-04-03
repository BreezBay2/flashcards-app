import React from "react";
import { Link } from "react-router-dom";
import "../styles/DeckCard.css";

const DeckCard = ({ deck: { id, name, description, lastOpened } }) => {
    return (
        <Link to={`/deck/${id}`} className="deck-link">
            <div className="deckcard">
                <h3>{name}</h3>
                <p>{description}</p>
                <p>{lastOpened}</p>
            </div>
        </Link>
    );
};

export default DeckCard;
