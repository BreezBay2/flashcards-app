import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DeckCard.css";
import DeleteDeckModal from "./DeleteDeckModal";
import { formatDeckDate } from "../utils/dateFormatter";

const DeckCard = ({ deck: { id, name, description, lastOpened } }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const formattedDate = formatDeckDate(lastOpened);

    const handleDeleteButton = (e) => {
        e.preventDefault();
        setModalOpen(true);
    };

    return (
        <>
            <Link to={`/deck/${id}`} className="deck-link">
                <div className="deckcard">
                    <div className="deckcard-header">
                        <h2>{name}</h2>
                        <button
                            className="deck-delete-button"
                            onClick={handleDeleteButton}
                        >
                            D
                        </button>
                    </div>
                    <p className="deckcard-description">{description}</p>
                    <p className="deckcard-timestamp">{formattedDate}</p>
                </div>
            </Link>

            {modalOpen && (
                <DeleteDeckModal
                    closeModal={() => {
                        setModalOpen(false);
                    }}
                    deckId={id}
                />
            )}
        </>
    );
};

export default DeckCard;
