import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import DeckCard from "../../components/DeckCard";
import CreateDeckModal from "../../components/CreateDeckModal";
import "../../styles/HomePage.css";

const HomePage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const {
        data: decks,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["decks"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/decks/all");
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
        <div className="home-page">
            <h2>Welcome back {authUser?.username}</h2>
            <div className="home-header">
                <h1>Decks</h1>
                <button
                    className="home-create-button"
                    onClick={() => setModalOpen(true)}
                >
                    Create New Deck
                </button>
            </div>

            {!isLoading && !isRefetching && decks && (
                <div className="home-decks-container">
                    {decks.map((deck) => (
                        <DeckCard key={deck.id} deck={deck} />
                    ))}
                </div>
            )}

            {modalOpen && (
                <CreateDeckModal
                    closeModal={() => {
                        setModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default HomePage;
