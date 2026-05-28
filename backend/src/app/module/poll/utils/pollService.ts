import { eq, sql } from "drizzle-orm";
import { db } from "../../../common/db/index.js";
import { io } from "../../../../index.js";
import { votesTable } from "../../../common/db/poll.schema.js";

export const broadcastPollMetrics = async (pollId: string) => {
    try {
        const distributionMetrics = await db
            .select({
                optionId: votesTable.option,
                votesCount: sql<number>`count(${votesTable.id})::int`,
            })
            .from(votesTable)
            .where(eq(votesTable.pollId, pollId))
            .groupBy(votesTable.option);

        const totalVotes = distributionMetrics.reduce(
            (acc, current) => acc + current.votesCount,
            0,
        );

        io.to(`poll:${pollId}`).emit("metrics_updated", {
            pollId,
            totalVotes,
            distribution: distributionMetrics,
        });

        console.log(
            `🚀 Real-time updates pushed perfectly to channel: poll:${pollId}`,
        );
    } catch (error) {
        console.error(
            `Failed executing isolated database metric aggregation broadcast for ${pollId}:`,
            error,
        );
    }
};
