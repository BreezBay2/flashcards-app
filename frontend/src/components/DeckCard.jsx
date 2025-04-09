import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DeckCard.css";
import DeleteDeckModal from "./DeleteDeckModal";

const DeckCard = ({ deck: { id, name, description, lastOpened } }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDeleteButton = (e) => {
        e.preventDefault();
        setModalOpen(true);
    };

    return (
        <>
            <Link to={`/deck/${id}`} className="deck-link">
                <div className="deckcard">
                    <div className="deckcard-header">
                        <h3>{name}</h3>
                        <button
                            className="deck-delete-button"
                            onClick={handleDeleteButton}
                        >
                            D
                        </button>
                    </div>
                    <p>{description}</p>
                    <p>{lastOpened}</p>
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
