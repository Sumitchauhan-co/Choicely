import { and, count, eq, gt } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import type { CreatePollInput, UpdatePollInput } from "./poll.model.js";
import apiError from "../../common/utils/apiError.js";
import { broadcastPollMetrics } from "./utils/pollService.js";
import { pollsTable, votesTable } from "../../common/db/poll.schema.js";

export const getPublicActivePollsService = async (
    isPublic: boolean,
    isActive: boolean,
) => {
    const polls = await db
        .select()
        .from(pollsTable)
        .where(
            and(
                eq(pollsTable.isPublic, isPublic),
                eq(pollsTable.isActive, isActive),
                gt(pollsTable.expiresAt, new Date()),
            ),
        );

    return polls || [];
};

export const getPublicActivePollsPaginationService = async (
    isPublic: boolean,
    isActive: boolean,
    page: number,
    limit: number,
) => {
    const whereConditions = and(
        eq(pollsTable.isPublic, isPublic),
        eq(pollsTable.isActive, isActive),
        gt(pollsTable.expiresAt, new Date()),
    );

    const [polls, totalCountResult] = await Promise.all([
        db
            .select()
            .from(pollsTable)
            .where(whereConditions)
            .limit(limit)
            .offset((page - 1) * limit),

        db.select({ total: count() }).from(pollsTable).where(whereConditions),
    ]);

    const totalItems = totalCountResult[0]?.total ?? 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        polls: polls || [],
        pagination: {
            totalItems,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

export const getPollByIdService = async (pollId: string) => {
    const [poll] = await db
        .select()
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId));

    return poll || null;
};

export const createPollService = async (
    userId: string,
    data: CreatePollInput,
) => {
    const [newPoll] = await db
        .insert(pollsTable)
        .values({
            name: data.name,
            creatorId: userId,
            question: data.question,
            options: data.options,
            isActive: data.isActive,
            isPublic: data.isPublic,
            allowMultipleVotes: data.allowMultipleVotes,
            expiresAt: data.expiresAt,
        })
        .returning();

    return newPoll;
};

export const updatePollService = async (
    pollId: string,
    userId: string,
    data: UpdatePollInput,
) => {
    const [updatedPoll] = await db
        .update(pollsTable)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(pollsTable.id, pollId), eq(pollsTable.creatorId, userId)))
        .returning();

    return updatedPoll || null;
};

export const deletePollService = async (pollId: string, userId: string) => {
    const [deletedPoll] = await db
        .delete(pollsTable)
        .where(and(eq(pollsTable.id, pollId), eq(pollsTable.creatorId, userId)))
        .returning();

    return !!deletedPoll;
};

export const voteService = async (
    pollId: string,
    option: string,
    userId: string,
) => {
    const [targetPoll] = await db
        .select()
        .from(pollsTable)
        .where(eq(pollsTable.id, pollId))
        .limit(1);

    if (!targetPoll) {
        throw apiError.badRequest(`Target poll entry not found`);
    }

    if (
        targetPoll.expiresAt &&
        new Date(targetPoll.expiresAt).getTime() <= Date.now()
    ) {
        throw apiError.badRequest(`This poll context has closed and expired!`);
    }

    const [existingVote] = await db
        .select()
        .from(votesTable)
        .where(
            and(eq(votesTable.userId, userId), eq(votesTable.pollId, pollId)),
        )
        .limit(1);

    if (existingVote) {
        throw apiError.badRequest(
            `You've already cast your selection choice ballot on this poll`,
        );
    }

    const pollOptions = targetPoll.options as string[];

    const isValidOption =
        pollOptions.includes(option) ||
        (!isNaN(Number(option)) &&
            Number(option) >= 0 &&
            Number(option) < pollOptions.length);

    if (!isValidOption) {
        throw apiError.badRequest(
            `Provided option selection does not match this poll`,
        );
    }

    await db.insert(votesTable).values({
        userId,
        pollId,
        option,
    });

    broadcastPollMetrics(pollId).catch((err) => console.error(err));
};

export const pollProfileService = async (userId: string) => {
    const userPolls = await db
        .select()
        .from(pollsTable)
        .where(eq(pollsTable.creatorId, userId));

    return userPolls;
};
