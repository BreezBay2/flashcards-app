import React from "react";
import "../styles/DeleteModal.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DeleteCardModal = ({ cardId, closeModal }) => {
    const queryClient = useQueryClient();

    const {
        mutate: deleteCard,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ cardId }) => {
            try {
                const res = await fetch(`/api/cards/${cardId}`, {
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
            queryClient.invalidateQueries({ queryKey: ["deck"] });
        },
    });

    const handleDelete = (e) => {
        e.preventDefault();
        deleteCard({ cardId });
    };

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeModal();
            }}
        >
            <div className="modal">
                <h2>Are you sure you want to delete this card?</h2>
                <div className="buttons">
                    <button className="no" onClick={() => closeModal()}>
                        No
                    </button>
                    <button className="yes" onClick={handleDelete}>
                        {isPending ? "..." : "Yes"}
                    </button>
                </div>
                {isError && <div className="error">{error.message}</div>}
            </div>
        </div>
    );
};

export default DeleteCardModal;
