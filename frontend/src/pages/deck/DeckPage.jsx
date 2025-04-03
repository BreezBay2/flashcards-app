import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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
        <div className="page">
            <h1>{deck?.name}</h1>
            <button
                className="create-button"
                onClick={() => setModalOpen(true)}
            >
                Create New Card
            </button>
            {!isLoading && !isRefetching && deck && (
                <div className="cards-container">
                    <CardTable deckId={id} />
                </div>
            )}

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
