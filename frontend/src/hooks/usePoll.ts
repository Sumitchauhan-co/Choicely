import { useEffect, useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

import api from "@/api/axios";

export interface Poll {
    id: string;
    name: string;
    isActive: boolean;
    isPublic: boolean;
    question: string;
    options: string[];
    creatorId: string;
    expiresAt?: string;
    allowMultipleVotes: boolean;
}

export const pollKeys = {
    all: ["polls"] as const,
    publicActive: () => [...pollKeys.all, "public", "active"] as const,
    userCreated: () => [...pollKeys.all, "user", "created"] as const,
    detail: (id: string) => [...pollKeys.all, "detail", id] as const,
};

export function usePublicActivePolls() {
    return useQuery<Poll[]>({
        queryKey: pollKeys.publicActive(),
        queryFn: async () => {
            const res = await api.get("/api/poll/");
            return res.data.data.filter((poll: Poll) => poll.isPublic === true);
        },
        refetchInterval: 30000,
    });
}

export interface PaginatedPollsResponse {
    polls: Poll[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export function usePublicActivePollsPagination(
    page: number,
    limit: number = 5
) {
    return useQuery<PaginatedPollsResponse>({
        queryKey: ["polls", "public", "active", { page, limit }],
        queryFn: async () => {
            const response = await api.get(
                `/api/poll/pagination?page=${page}&limit=${limit}`
            );

            return response.data.data;
        },
        placeholderData: previousData => previousData,
    });
}

export function useGetPollById(pollId: string) {
    return useQuery<Poll>({
        queryKey: pollKeys.detail(pollId),
        queryFn: async () => {
            try {
                const res = await api.get(`/api/poll/${pollId}`);
                return res.data.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.error ||
                            "Failed to locate poll data.",
                        { cause: error }
                    );
                }
                throw error;
            }
        },
        enabled: !!pollId,
    });
}

export interface CreatePollPayload {
    name: string;
    question: string;
    options: string[];
    expiresAt?: string;
    isPublic: boolean;
    isActive: boolean;
    allowMultipleVotes: boolean;
}

export function useCreatePoll() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pollData: CreatePollPayload) => {
            try {
                const res = await api.post("/api/poll/create", pollData);
                return res.data.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.message ||
                            "Failed to create poll.",
                        { cause: error }
                    );
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: pollKeys.publicActive(),
            });
        },
    });
}

export function useUpdatePoll() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            pollId,
            data,
            onClose,
        }: {
            pollId: string;
            data: Partial<Poll>;
            onClose?: () => void;
        }) => {
            const res = await api.patch(`/api/poll/update/${pollId}`, data);
            const updatedData = res.data;
            return { updatedData, onClose };
        },
        onSuccess: variables => {
            queryClient.invalidateQueries({ queryKey: ["user-polls"] });

            toast.success("Poll settings updated successfully.");

            if (variables?.onClose) {
                variables.onClose();
            }
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to save poll updates.");
        },
    });
}

export function useDeletePoll() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pollId }: { pollId: string }) => {
            return await api.delete(`/api/poll/delete/${pollId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-polls"] });

            toast.success("Poll deleted successfully.");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to delete poll.");
        },
    });
}

export interface CastVotePayload {
    pollId: string;
    option: string;
}

interface UseCastVoteOptions {
    onSuccess?: () => void;
    onSettled?: () => void;
}

export function useCastVote(options?: UseCastVoteOptions) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ pollId, option }: CastVotePayload) => {
            const toastId = toast.loading("Recording your vote...");

            try {
                const res = await api.post(`/api/poll/${pollId}/vote`, {
                    option,
                });
                return { ...res.data, toastId, pollId };
            } catch (error) {
                let errorMessage = "Failed to catalog your vote selection.";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: res => {
            const toastId = res?.toastId;
            const pollId = res?.pollId;

            queryClient.invalidateQueries({
                queryKey: pollKeys.detail(pollId),
            });

            toast.success("Vote is successfully submitted!", {
                id: toastId,
                description:
                    "Your choice has been securely saved to the live server.",
                duration: 5000,
                action: {
                    label: "Go Back",
                    onClick: () => navigate({ to: "/poll" }),
                },
            });

            options?.onSuccess?.();
        },
        onSettled: () => {
            options?.onSettled?.();
        },
    });
}

interface PollMetric {
    option: string;
    votesCount: number;
}

interface SocketPayload {
    pollId: string;
    totalVotes: number;
    distribution: PollMetric[];
}

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;

export function usePollSocket(pollId: string) {
    const socketRef = useRef<Socket | null>(null);
    const [liveMetrics, setLiveMetrics] = useState<SocketPayload | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!pollId) return;

        const socketInstance = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            closeOnBeforeunload: false,
        });

        socketRef.current = socketInstance;

        socketInstance.on("connect", () => {
            console.log("⚡ Connected to real-time sync engine");
            setIsConnected(true);
            socketInstance.emit("join_poll", pollId);
        });

        socketInstance.on("disconnect", reason => {
            console.warn(`⚠️ Socket disconnected: ${reason}`);
            setIsConnected(false);
        });

        socketInstance.on("connect_error", error => {
            console.error("❌ Socket initialization failure:", error.message);
        });

        socketInstance.on("metrics_updated", (data: SocketPayload) => {
            console.log(
                "📊 Real-time distribution snapshot sync received:",
                data
            );
            if (data.pollId === pollId) {
                setLiveMetrics(data);
            }
        });

        return () => {
            if (socketInstance.connected) {
                socketInstance.emit("leave_poll", pollId);
            }
            socketInstance.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [pollId]);

    return { liveMetrics, isConnected };
}

export function useUserCreatedPolls() {
    return useQuery<Poll[]>({
        queryKey: pollKeys.userCreated(),
        queryFn: async () => {
            try {
                const res = await api.get("/api/poll/profile");
                console.log(res);
                return res.data.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.message ||
                            "Failed to load your polls.",
                        { cause: error }
                    );
                }
                throw error;
            }
        },
    });
}
