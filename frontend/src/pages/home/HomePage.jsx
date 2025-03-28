import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DeckCard from "../../components/DeckCard";

const HomePage = () => {
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
            } catch (error) {}
        },
    });

    return (
        <div>
            <h1>HomePage</h1>
            <h2>Welcome back {authUser?.username}</h2>
            <h3>Decks</h3>

            {!isLoading && !isRefetching && decks && (
                <div>
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
        </div>
    );
};

export default HomePage;
