import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
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

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className="home-link">
                    Home
                </Link>
                <button
                    className="logout-button"
                    onClick={(e) => {
                        e.preventDefault();
                        logout();
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
