import bcryptjs from "bcryptjs";

import prisma from "../db/prisma.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password, confirmPassword } =
            req.body;

        if (!username || !fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Fill out all fields" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email format" });
        }

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ error: "Password confirmation failed" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password has to be at least 6 characters long",
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                fullname,
                email,
                password: hashedPassword,
            },
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser.id, res);

            res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
            });
        } else {
            return res.status(400).json({ error: "Invalid User Data" });
        }
    } catch (error) {
        console.log("Something went wrong while signing up: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });

        const passwordCheck = await bcryptjs.compare(
            password,
            user?.password || ""
        );

        if (!user || !passwordCheck) {
            return res
                .status(400)
                .json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user.id, res);

        res.status(200).json({
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
        });
    } catch (error) {
        console.log("Something went wrong logging in: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Something went wrong while logging out: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
