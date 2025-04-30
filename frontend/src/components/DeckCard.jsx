import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/DeckCard.css";
import DeleteDeckModal from "./DeleteDeckModal";
import { formatDeckDate } from "../utils/dateFormatter";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegFolderClosed } from "react-icons/fa6";

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
                        <h2 className="deckcard-title">
                            <FaRegFolderClosed size={30} />
                            {name}
                        </h2>
                        <div className="deck-delete-button">
                            <FaRegTrashAlt
                                size={20}
                                onClick={handleDeleteButton}
                            />
                        </div>
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
