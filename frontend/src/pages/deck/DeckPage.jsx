import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import React from "react";
import CardTable from "../../components/CardTable";

const DeckPage = () => {
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
        <div>
            <h1>DeckPage</h1>
            <p>{deck?.name}</p>
            <CardTable deckId={id} />
        </div>
    );
};

export default DeckPage;
