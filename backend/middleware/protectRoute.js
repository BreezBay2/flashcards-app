import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized. No Token provided." });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res
                .status(401)
                .json({ error: "Unauthorized. Invalid Token." });
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.userId },
            select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(
            "Something went wrong in the Protect Route:",
            error.message
        );
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectRoute;
