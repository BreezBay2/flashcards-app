import React, { useState } from "react";
import "../styles/CreateModal.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateDeckModal = ({ closeModal }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [studyType, setStudyType] = useState("SRS");

    const queryClient = useQueryClient();

    const {
        mutate: createDeck,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ name, description, studyType }) => {
            try {
                const res = await fetch("/api/decks/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, description, studyType }),
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
            queryClient.invalidateQueries({ queryKey: ["decks"] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createDeck({ name, description, studyType });
    };

    return (
        <div
            className="create-modal-container"
            onClick={(e) => {
                if (e.target.className === "create-modal-container")
                    closeModal();
            }}
        >
            <div className="create-modal">
                <form className="create-form">
                    <label>Name</label>
                    <input
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label>Type</label>
                    <select
                        name="studyType"
                        value={studyType}
                        onChange={(e) => setStudyType(e.target.value)}
                    >
                        <option>No</option>
                        <option>SRS</option>
                        <option>Daily</option>
                    </select>
                    <button type="submit" onClick={handleSubmit}>
                        {isPending ? "Creating Deck..." : "Create Deck"}
                    </button>
                    {isError && (
                        <div className="create-error">{error.message}</div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateDeckModal;
