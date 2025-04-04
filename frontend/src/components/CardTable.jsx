import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import "../styles/CardTable.css";
import DeleteCardModal from "./DeleteCardModal";

const CardTable = ({ deckId }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [cardId, setCardId] = useState("");

    const {
        data: cards,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["cards"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/cards/${deckId}`);
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
        <div className="table-container">
            {cards ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className="expand">Front</th>
                            <th className="expand">Back</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="expand">{card.frontText}</td>
                                    <td className="expand">{card.backText}</td>
                                    <td>
                                        <button
                                            className="card-delete-button"
                                            onClick={() => {
                                                setCardId(card.id);
                                                setModalOpen(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <h1>This deck does not have any cards yet!</h1>
            )}
            {modalOpen && (
                <DeleteCardModal
                    closeModal={() => {
                        setModalOpen(false);
                    }}
                    cardId={cardId}
                />
            )}
        </div>
    );
};

export default CardTable;
