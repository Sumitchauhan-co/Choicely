import { Server } from "socket.io";
import app from "./app/module/app.js";
import "dotenv/config";
import dotenvExpand from "dotenv-expand";
import { createServer } from "node:http";
import { broadcastPollMetrics } from "./app/module/poll/utils/pollService.js";
import { configDotenv } from "dotenv";

const myEnv = configDotenv();
dotenvExpand.expand(myEnv);

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket) => {
    console.log(`📡 Socket pipeline connected: ${socket.id}`);

    socket.on("join_poll", async (pollId: string) => {
        if (!pollId) return;
        socket.join(`poll:${pollId}`);
        console.log(
            `🔒 Client [${socket.id}] joined room channel: poll:${pollId}`,
        );

        await broadcastPollMetrics(pollId);
    });

    socket.on("leave_poll", (pollId: string) => {
        if (!pollId) return;
        socket.leave(`poll:${pollId}`);
        console.log(
            `runner Client [${socket.id}] left room channel: poll:${pollId}`,
        );
    });

    socket.on("disconnect", () => {
        console.log(`🔌 Connection closed: ${socket.id}`);
    });
});

// start server

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
