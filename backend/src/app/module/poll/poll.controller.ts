import type { Request, Response } from "express";
import {
    createPollService,
    deletePollService,
    getPollByIdService,
    getPublicActivePollsPaginationService,
    getPublicActivePollsService,
    pollProfileService,
    updatePollService,
    voteService,
} from "./poll.service.js";
import apiError from "../../common/utils/apiError.js";
import apiResponse from "../../common/utils/apiResponse.js";

const getPublicActivePolls = async (req: Request, res: Response) => {
    const isPublic = true;
    const isActive = true;

    const polls = await getPublicActivePollsService(isPublic, isActive);

    if (!polls || polls.length === 0) {
        throw apiError.notFound("No active public poll found");
    }

    return apiResponse.ok(res, "Polls found successfully", polls);
};

const getPublicActivePollsPagination = async (req: Request, res: Response) => {
    const isPublic = true;
    const isActive = true;

    const pageNumber = req.query.page;
    const limitNumber = req.query.limit;

    if (typeof pageNumber !== "string") {
        throw apiError.badRequest("Type of page should be number");
    }

    if (typeof limitNumber !== "string") {
        throw apiError.badRequest("Type of limit should be number");
    }

    const page = parseInt(pageNumber);
    const limit = parseInt(limitNumber);

    const { polls, pagination } = await getPublicActivePollsPaginationService(
        isPublic,
        isActive,
        page,
        limit,
    );

    if (!polls || polls.length === 0) {
        throw apiError.notFound("No active public poll found");
    }

    return apiResponse.ok(res, "Polls found successfully", {
        polls,
        pagination,
    });
};

const getPollById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        throw apiError.badRequest("Invalid request");
    }

    const poll = await getPollByIdService(id);

    if (!poll) {
        throw apiError.notFound("Poll not found");
    }

    return apiResponse.ok(res, "Poll found successfully", poll);
};

const createPoll = async (req: Request, res: Response) => {
    const validatedPollData = req.body;

    const userId = req.user?.id;

    if (!userId) {
        throw apiError.unauthorized("Unauthorised access to poll");
    }

    const poll = await createPollService(userId, validatedPollData);

    return apiResponse.created(res, "Poll created successfully", poll);
};

const updatePoll = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id);

    const userId = req.user?.id;
    console.log(userId);

    if (!id || Array.isArray(id)) {
        throw apiError.badRequest("Invalid request");
    }

    if (!userId) {
        throw apiError.unauthorized("Unauthorised access to poll");
    }

    const updatedPoll = await updatePollService(id, userId, req.body);

    if (!updatedPoll) {
        throw apiError.forbidden("Forbidden request to update poll");
    }

    return apiResponse.ok(res, "Poll updated successfully", updatedPoll);
};

const deletePoll = async (req: Request, res: Response) => {
    const id = req.params.id;

    const userId = req.user?.id;

    if (!id || Array.isArray(id)) {
        throw apiError.notFound("Poll not found");
    }

    if (!userId) {
        throw apiError.unauthorized("Unauthorised access to poll");
    }

    const isDeleted = await deletePollService(id, userId);

    if (!isDeleted) {
        throw apiError.forbidden("Forbidden request to delete poll");
    }

    return apiResponse.ok(res, "Poll deleted successfully");
};

const vote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { option } = req.body;
    const userId = req.user?.id;

    if (!id || Array.isArray(id)) {
        throw apiError.badRequest("Invalid request");
    }

    if (!userId) {
        throw apiError.unauthorized("Unauthorised access to poll");
    }

    if (!option) {
        throw apiError.notFound("Option id missing");
    }

    await voteService(id, option, userId);

    return apiResponse.ok(res, "Vote cataloged successfully");
};

const pollProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw apiError.unauthorized("Unauthorised access to user polls");
    }

    const userPolls = await pollProfileService(userId);

    return apiResponse.ok(res, "User polls fetched successfully", userPolls);
};

export default {
    getPublicActivePolls,
    getPublicActivePollsPagination,
    getPollById,
    createPoll,
    updatePoll,
    deletePoll,
    vote,
    pollProfile,
};
