import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
        <div>
            <div>
                <h1>SignUpPage</h1>
                <form onSubmit={handleSubmit}>
                    <h2>Create an Account</h2>
                    <input
                        type="email"
                        placeholder="E-Mail"
                        name="email"
                        onChange={handleInputChange}
                        value={formData.email}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleInputChange}
                        value={formData.username}
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="fullname"
                        onChange={handleInputChange}
                        value={formData.fullname}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                        value={formData.password}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={handleInputChange}
                        value={formData.confirmPassword}
                    />
                    <button>{isPending ? "Is Loading..." : "Sign Up"}</button>
                    {isError && <p>{error.message}</p>}
                </form>
                <div>
                    <p>Already have an account?</p>
                    <Link to="/login">
                        <button>Sign In</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
