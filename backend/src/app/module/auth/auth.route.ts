import express, { type Router } from "express";
import authController from "./auth.controller.js";
import { authenticate, forgotPasswordLimiter } from "./auth.middleware.js";
import { validate } from "../../common/middleware/validate.js";
import { contactModel, signinModel, signupModel } from "./auth.model.js";

const router: Router = express.Router();

router.post("/signup", validate(signupModel), authController.signup);

router.post("/signin", validate(signinModel), authController.signin);

router.post("/signout", authenticate, authController.signout);

router.post("/refresh", authController.refresh);

router.get("/get-user", authenticate, authController.getUser);

router.get("/profile/:id", authController.profile);

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    authController.forgotPassword,
);

router.post("/reset-password", authController.resetPassword);

router.get("/verify-email", authController.verifyEmail);

router.post("/contact", validate(contactModel), authController.contact);

export default router;
