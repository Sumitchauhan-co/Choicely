import type { Request, Response, NextFunction } from "express";
import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import {
    Strategy as GoogleStrategy,
    type Profile,
    type VerifyCallback,
} from "passport-google-oauth20";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { eq } from "drizzle-orm";

// Routers
import authRouter from "./auth/auth.route.js";
import pollRouter from "./poll/poll.route.js";
import { usersTable } from "../common/db/auth.schema.js";
import { db } from "../common/db/index.js";

interface HttpError extends Error {
    statusCode?: number;
}

const app: Application = express();
const PostgresSessionStore = pgSession(session);

// --- 1. Global Pre-Middlewares ---
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// --- 2. Production Proxy & Session Configuration ---
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
    app.set("trust proxy", 1);
}

app.use(
    session({
        store: new PostgresSessionStore({
            conString: process.env.DATABASE_URL,
            tableName: "session",
            createTableIfMissing: true,
        }),
        secret:
            process.env.SESSION_SECRET || "fallback_secret_dont_use_in_prod",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 Hours
            sameSite: isProduction ? "none" : "lax",
        },
        proxy: isProduction,
    }),
);

// --- 3. Passport Session Lifecycle Setup ---
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

// --- 4. Google OAuth Strategy Configuration ---
const PORT = process.env.PORT || 5000;
const callbackURL = isProduction
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : `http://localhost:${PORT}/auth/google/callback`;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
            callbackURL: callbackURL,
            scope: ["profile", "email"],
        },
        async (
            _accessToken: string,
            _refreshToken: string,
            profile: Profile,
            done: VerifyCallback,
        ) => {
            try {
                if (!profile.id || !profile.emails?.[0]?.value) {
                    return done(
                        new Error(
                            "Incomplete profile data received from Google OAuth payload.",
                        ),
                        undefined,
                    );
                }

                const email = profile.emails[0].value;
                const authId = profile.id;

                const firstName =
                    profile.name?.givenName ||
                    profile.displayName ||
                    "Workspace";
                const lastName = profile.name?.familyName || "";

                // 1. Query user checking our dedicated unique varchar authId column
                const existingUsers = await db
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.authId, authId))
                    .limit(1);

                let user = existingUsers[0];

                // 2. If it's a new registration, create the profile row entry
                if (!user) {
                    const insertedUsers = await db
                        .insert(usersTable)
                        .values({
                            authId,
                            email,
                            firstName,
                            lastName,
                            password: "",
                        })
                        .returning();

                    user = insertedUsers[0];
                }

                return done(null, {
                    ...user,
                    updatedAt: user?.updatedAt ?? new Date(),
                } as Express.User);
            } catch (err) {
                return done(err as Error, undefined);
            }
        },
    ),
);

// --- 5. Core API Application Routing Layers ---
app.use("/api/auth", authRouter);
app.use("/api/poll", pollRouter);

app.get("/health", (req, res) =>
    res.json({ message: "Server is healthy", healthy: true }),
);

// OAuth Gateway Triggers
app.get(
    "/auth/google",
    passport.authenticate("google", {
        accessType: "offline",
        prompt: "consent",
    }),
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/auth/signin" }),
    (req, res) => {
        const targetRedirect =
            process.env.FRONTEND_URL || "http://localhost:5173";
        res.redirect(`${targetRedirect}/`);
    },
);

// --- 6. Global Catch-All Error Handling Middleware ---
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;
