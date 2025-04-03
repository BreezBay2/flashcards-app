import React, { useState } from "react";
import "../styles/CreateModal.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateCardModal = ({ deckId, closeModal }) => {
    const [frontText, setFrontText] = useState("");
    const [backText, setBackText] = useState("");

    const queryClient = useQueryClient();

    const {
        mutate: createCard,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ frontText, backText }) => {
            try {
                const res = await fetch(`/api/cards/create/${deckId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ frontText, backText }),
                });
                const data = res.json();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        createCard({ frontText, backText });
    };

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeModal();
            }}
        >
            <div className="modal">
                <form className="create-form">
                    <label>Front</label>
                    <textarea
                        name="frontText"
                        value={frontText}
                        onChange={(e) => setFrontText(e.target.value)}
                    />
                    <label>Back</label>
                    <textarea
                        name="backText"
                        value={backText}
                        onChange={(e) => setBackText(e.target.value)}
                    />
                    <button type="submit" onClick={handleSubmit}>
                        {isPending ? "Creating Card..." : "Create Card"}
                    </button>
                    {isError && <div className="error">{error.message}</div>}
                </form>
            </div>
        </div>
    );
};

export default CreateCardModal;
