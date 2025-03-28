import { useQuery } from "@tanstack/react-query";
import React from "react";

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
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Front</th>
                        <th>Back</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cards
                        ? cards.map((card, index) => {
                              console.log(cards);
                              return (
                                  <tr key={index}>
                                      <td>{index}</td>
                                      <td>{card.frontText}</td>
                                      <td>{card.backText}</td>
                                      <td>
                                          <span>Delete </span>
                                          <span>Edit</span>
                                      </td>
                                  </tr>
                              );
                          })
                        : null}
                </tbody>
            </table>
        </div>
    );
};

export default CardTable;
