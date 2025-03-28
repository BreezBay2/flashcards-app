import React from "react";
import { Link } from "react-router-dom";

const DeckCard = ({ deck: { id, name, description, lastOpened } }) => {
    return (
        <Link to={`/deck/${id}`}>
            <div>
                <h3>{name}</h3>
                <p>{description}</p>
                <p>{lastOpened}</p>
            </div>
        </Link>
    );
};

export default DeckCard;
