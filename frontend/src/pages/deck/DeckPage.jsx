import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import React, { useState } from "react";
import CardTable from "../../components/CardTable";
import CreateCardModal from "../../components/CreateCardModal";
import "../../styles/DeckPage.css";

const DeckPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const { id } = useParams();

    const {
        data: deck,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["deck"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/decks/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    return (
        <div className="deck-page">
            <h1>{deck?.name}</h1>
            <div className="deck-page-buttons">
                <button
                    className="create-card-button"
                    onClick={() => setModalOpen(true)}
                >
                    Create New Card
                </button>
                <Link to="/study">
                    <button className="study-button">Study</button>
                </Link>
            </div>
            {!isLoading && !isRefetching && deck && <CardTable deckId={id} />}

            {modalOpen && (
                <CreateCardModal
                    closeModal={() => {
                        setModalOpen(false);
                    }}
                    deckId={id}
                />
            )}
        </div>
    );
};

export default DeckPage;
