import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const queryClient = useQueryClient();
    const {
        mutate: login,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to login");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1>LoginPage</h1>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={handleInputChange}
                    value={formData.username}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                />
                <button>{isPending ? "Loading..." : "Login"}</button>
                {isError && <p>{error.message}</p>}
            </form>
            <div>
                <p>Don't have an account?</p>
                <Link to="/signup">
                    <button>Sign Up</button>
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
