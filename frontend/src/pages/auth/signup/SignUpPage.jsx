import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/SignUpPage.css";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullname: "",
        password: "",
        confirmPassword: "",
    });

    const queryClient = useQueryClient();

    const {
        mutate: signup,
        isError,
        isPending,
        error,
    } = useMutation({
        mutationFn: async ({
            username,
            fullname,
            email,
            password,
            confirmPassword,
        }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        fullname,
                        email,
                        password,
                        confirmPassword,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to create account");
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            console.log("Account created successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1>Create an Account</h1>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label>E-Mail</label>
                    <input
                        type="email"
                        placeholder="E-Mail"
                        name="email"
                        onChange={handleInputChange}
                        value={formData.email}
                    />
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleInputChange}
                        value={formData.username}
                    />
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="fullname"
                        onChange={handleInputChange}
                        value={formData.fullname}
                    />
                    <div className="signup-passwords">
                        <div className="signup-password">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleInputChange}
                                value={formData.password}
                            />
                        </div>
                        <div className="signup-password">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                onChange={handleInputChange}
                                value={formData.confirmPassword}
                            />
                        </div>
                    </div>

                    <button>{isPending ? "Is Loading..." : "Sign Up"}</button>
                    {isError && <p>{error.message}</p>}
                </form>
                <div className="login-link">
                    <p>Already have an account?</p>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
