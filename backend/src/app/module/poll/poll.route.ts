import express, { type Router } from "express";
import pollController from "./poll.controller.js";
import { validate } from "../../common/middleware/validate.js";
import { createPollModel, updatePollModel } from "./poll.model.js";
import { authenticate } from "../auth/auth.middleware.js";

const router: Router = express.Router();

router.get("/", pollController.getPublicActivePolls);

router.get("/pagination/", pollController.getPublicActivePollsPagination);

router.get("/profile", authenticate, pollController.pollProfile);

router.get("/:id", pollController.getPollById);

router.post("/:id/vote", authenticate, pollController.vote);

router.post(
    "/create",
    authenticate,
    validate(createPollModel),
    pollController.createPoll,
);

router.patch(
    "/update/:id",
    authenticate,
    validate(updatePollModel),
    pollController.updatePoll,
);

router.post("/delete/:id", authenticate, pollController.deletePoll);

export default router;
