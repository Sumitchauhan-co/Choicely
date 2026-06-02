import type { Request, Response, NextFunction } from 'express';
import express, { type Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import {
    Strategy as GoogleStrategy,
    type Profile,
    type VerifyCallback,
} from 'passport-google-oauth20';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import authRouter from './auth/auth.route.js';
import pollRouter from './poll/poll.route.js';
import authController from './auth/auth.controller.js';

interface HttpError extends Error {
    statusCode?: number;
}

declare global {
    namespace Express {
        interface User {
            id: string;
            authId: string | null;
            email: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
        }
    }
}

const app: Application = express();
const PostgresSessionStore = pgSession(session);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(cookieParser());

if (isProduction) app.set('trust proxy', 1);

app.use(
    session({
        store: new PostgresSessionStore({
            conString: process.env.DATABASE_URL,
            tableName: 'session',
            createTableIfMissing: true,
            errorLog: (err) =>
                console.error('Session Store Error Fallback:', err),
        }),
        secret:
            process.env.SESSION_SECRET || 'fallback_secret_dont_use_in_prod',
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: isProduction ? 'none' : 'lax',
        },
        proxy: isProduction,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
    try {
        const currentUser = await authController.findUserById(id);
        if (!currentUser) return done(null, null);
        done(null, currentUser as Express.User);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
            scope: ['profile', 'email'],
            proxy: true,
        },
        async (
            _accessToken: string,
            _refreshToken: string,
            profile: Profile,
            done: VerifyCallback,
        ) => {
            try {
                const user =
                    await authController.handleGoogleOauthUser(profile);
                return done(null, user as Express.User);
            } catch (err) {
                return done(err as Error, undefined);
            }
        },
    ),
);

app.use('/api/auth', authRouter);
app.use('/api/poll', pollRouter);

app.get('/health', (_req, res) =>
    res.json({ message: 'Server is healthy', healthy: true }),
);

app.get(
    '/auth/google',
    passport.authenticate('google', {
        accessType: 'offline',
        prompt: 'consent',
    }),
);
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/signin' }),
    (_req, res) => {
        const targetRedirect =
            process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${targetRedirect}/`);
    },
);

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

export default app;
