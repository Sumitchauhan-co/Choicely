import type { NextFunction, Request, Response } from "express";
import {
    contactService,
    forgotPasswordService,
    getUserService,
    profileService,
    refreshService,
    resetPasswordService,
    signinService,
    signoutService,
    signupService,
    verifyEmailService,
} from "./auth.service.js";
import apiResponse from "../../common/utils/apiResponse.js";
import apiError from "../../common/utils/apiError.js";
import type { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

const signup = async (req: Request, res: Response) => {
    const { user, accessToken } = await signupService(req.body);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);

    return apiResponse.created(res, "User created successfully", {
        user,
        accessToken,
    });
};

const signin = async (req: Request, res: Response) => {
    const { user, accessToken } = await signinService(req.body);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);

    return apiResponse.ok(res, "User created successfully", {
        user,
        accessToken,
    });
};

const signout = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        throw apiError.notFound("User not found");
    }

    if (req.isAuthenticated && req.isAuthenticated()) {
        return req.logout((err) => {
            if (err) return next(err);

            if (req.session) {
                return req.session.destroy(async (destroyErr) => {
                    if (destroyErr) return next(destroyErr);

                    await signoutService(user);

                    res.clearCookie("connect.sid", cookieOptions);

                    res.clearCookie("refreshToken", cookieOptions);

                    return apiResponse.ok(
                        res,
                        "User signed out successfully from session tracking",
                    );
                });
            }
        });
    }

    await signoutService(user);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    return apiResponse.ok(res, "User signed out successfully");
};

const refresh = async (req: Request, res: Response) => {
    if (req.user) {
        if (req.session) {
            req.session.touch();
        }

        return apiResponse.ok(
            res,
            "Session verified and extended successfully",
            {
                accessToken: null,
                user: {
                    id: req.user.id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    role: req.user.role,
                    createdAt: req.user.createdAt,
                },
            },
        );
    }
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw apiError.unauthorized("Invalid or expired token");
    }

    const { accessToken, user } = await refreshService(refreshToken);

    if (!user) {
        throw apiError.notFound("User not found");
    }

    res.cookie("refreshToken", user.refreshToken, cookieOptions);

    return apiResponse.ok(res, "Token refreshed successfully", {
        accessToken,
        user,
    });
};

const profile = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw apiError.notFound("Profile not found");
    }
    const user = await profileService(id);

    return apiResponse.ok(res, "User profile fetched successfully", {
        user,
    });
};

const forgotPassword = async (req: Request, res: Response) => {
    const email = req.body.email;

    if (!email) {
        throw apiError.notFound("Email not found");
    }

    await forgotPasswordService(email);

    return apiResponse.ok(
        res,
        "Email sent successfully to the existing account",
    );
};

const resetPassword = async (req: Request, res: Response) => {
    const { newPassword, confirmPassword } = req.body;

    const token = req.query.token as string;

    if (newPassword !== confirmPassword) {
        throw apiError.badRequest("Password incorrect");
    }

    if (!token || Array.isArray(token)) {
        throw apiError.unauthorized("Invalid token");
    }

    const user = await resetPasswordService({ token, newPassword });

    return apiResponse.ok(res, "Password reset successfully", { user });
};

const verifyEmail = async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token || Array.isArray(token)) {
        throw apiError.unauthorized("Invalid token");
    }

    const { user } = await verifyEmailService(token);

    return apiResponse.ok(res, "Email verified successfully", { user });
};

const getUser = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        throw apiError.notFound("User not found");
    }

    const result = await getUserService(user.id);

    return apiResponse.ok(res, "User fetched successfully", result);
};

const contact = async (req: Request, res: Response) => {
    const { name, subject, phone, email, message } = req.body;

    const contactData = await contactService(
        name,
        subject,
        email,
        phone,
        message,
    );

    if (!contactData) {
        throw apiError.notFound("Contact details not found");
    }

    return apiResponse.ok(
        res,
        "Contact details submitted successfully",
        contactData,
    );
};

export default {
    getUser,
    signup,
    signin,
    signout,
    refresh,
    profile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    contact,
};
