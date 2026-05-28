import type { Request, Response, NextFunction } from "express";
import apiError from "../../common/utils/apiError.js";
import { verifyAccessToken } from "./utils/token.js";
import { usersTable } from "../../common/db/auth.schema.js";
import { db } from "../../common/db/index.js";
import { eq } from "drizzle-orm";
import rateLimit from "express-rate-limit";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (req.isAuthenticated && req.isAuthenticated() && req.user) {
            return next();
        }

        const header = req.headers["authorization"];

        if (!header || !header.startsWith("Bearer ")) {
            throw apiError.badRequest(
                "Invalid authorization header or missing session cookie",
            );
        }

        const token = header.split(" ")[1];
        if (!token) {
            throw apiError.unauthorized("Not authorized for the action");
        }

        const decoded = (await verifyAccessToken(token)) as {
            id: string;
            role: "user" | "admin";
        };

        const [user] = await db
            .select({
                id: usersTable.id,
                role: usersTable.role,
            })
            .from(usersTable)
            .where(eq(usersTable.id, decoded.id));

        if (!user) {
            throw apiError.unauthorized("User no longer exists");
        }

        req.user = {
            id: user.id,
            role: user.role,
        } as any;

        next();
    } catch (error) {
        next(apiError.unauthorized("Invalid or expired token or session"));
    }
};

export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: {
        message: "Too many password reset attempts! Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
