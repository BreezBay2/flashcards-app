import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/LoginPage.css";

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
        <div className="page">
            <div className="container">
                <h1>Login</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleInputChange}
                        value={formData.username}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                        value={formData.password}
                    />
                    <button className="login-button">
                        {isPending ? "Loading..." : "Login"}
                    </button>
                    {isError && <p>{error.message}</p>}
                </form>
                <div className="signup-container">
                    <p>Don't have an account?</p>
                    <Link to="/signup">
                        <button>Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
