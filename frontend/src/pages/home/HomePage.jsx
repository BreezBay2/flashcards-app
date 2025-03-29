import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import DeckCard from "../../components/DeckCard";
import CreateDeckModal from "../../components/CreateDeckModal";

const HomePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        mutate: logout,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("/api/auth/logout", {
                    method: "POST",
                });

                const authUser = await res.json();

                if (!res.ok) {
                    throw new Error(authUser.error || "Something went wrong");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: () => {
            console.log("Logout failed");
        },
    });

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
        <div>
            <h1>HomePage</h1>
            <h2>Welcome back {authUser?.username}</h2>
            <h3>Decks</h3>

            {!isLoading && !isRefetching && decks && (
                <div>
                    <button onClick={() => setModalOpen(true)}>
                        Create New Deck
                    </button>
                    <ul>
                        {decks.map((deck) => (
                            <DeckCard key={deck.id} deck={deck} />
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={(e) => {
                    e.preventDefault();
                    logout();
                }}
            >
                Logout
            </button>

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
