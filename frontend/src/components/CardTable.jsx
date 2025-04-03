import { useQuery } from "@tanstack/react-query";
import React from "react";
import "../styles/CardTable.css";

const CardTable = ({ deckId }) => {
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

                console.log(data);
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th className="expand">Front</th>
                    <th className="expand">Back</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cards
                    ? cards.map((card, index) => {
                          console.log(cards);
                          return (
                              <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="expand">{card.frontText}</td>
                                  <td className="expand">{card.backText}</td>
                                  <td>
                                      <button className="action-button">
                                          Delete
                                      </button>
                                  </td>
                              </tr>
                          );
                      })
                    : null}
            </tbody>
        </table>
    );
};

export default CardTable;
