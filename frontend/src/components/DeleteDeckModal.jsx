import React from "react";
import "../styles/DeleteModal.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DeleteDeckModal = ({ deckId, closeModal }) => {
    const queryClient = useQueryClient();

    const {
        mutate: deleteDeck,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ deckId }) => {
            try {
                const res = await fetch(`/api/decks/${deckId}`, {
                    method: "DELETE",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ["decks"] });
        },
    });

    const handleDelete = (e) => {
        e.preventDefault();
        deleteDeck({ deckId });
    };

    return (
        <div
            className="delete-modal-container"
            onClick={(e) => {
                if (e.target.className === "delete-modal-container")
                    closeModal();
            }}
        >
            <div className="delete-modal">
                <h2>
                    Are you sure you want to delete this deck and all its cards?
                </h2>
                <div className="delete-modal-buttons">
                    <button className="delete-no" onClick={() => closeModal()}>
                        No
                    </button>
                    <button className="delete-yes" onClick={handleDelete}>
                        {isPending ? "..." : "Yes"}
                    </button>
                </div>
                {isError && <div className="delete-error">{error.message}</div>}
            </div>
        </div>
    );
};

export default DeleteDeckModal;
