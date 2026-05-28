import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";
import { Plus, GlobeOff } from "lucide-react";
import { toast } from "sonner";

import { PollCard } from "./PollCard";
import { usePublicActivePollsPagination } from "../../hooks/usePoll";
import { LoadingAnimation } from "../../shared/LoadingAnimation";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

export default function PollFeed() {
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data directly using backend page parameters
    const { data, isLoading, isError, isPlaceholderData } =
        usePublicActivePollsPagination(currentPage, ITEMS_PER_PAGE);

    useEffect(() => {
        if (isError) {
            toast.error("Failed to connect the poll data", {
                description: "No connection established!",
            });
        }
    }, [isError]);

    // Extract values safely from paginated backend response payload structure
    const polls = data?.polls ?? [];
    const pagination = data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const totalItems = pagination?.totalItems ?? 0;

    return (
        <div className="bg-background text-foreground selection:bg-primary/10 min-h-screen px-4 py-12 antialiased sm:px-6">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header Row */}
                <div className="border-border/50 flex items-center justify-between border-b pb-5">
                    <div className="bg-secondary/50 border-border/60 inline-flex items-center gap-3 rounded-xl border px-3 py-1.5 backdrop-blur-xs">
                        <div className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <h2 className="text-foreground/90 font-sans text-sm font-bold tracking-tight">
                            Active Polls
                        </h2>
                        <span className="text-primary bg-background border-border/40 rounded-md border px-2 py-0.5 font-mono text-xs font-black shadow-xs dark:bg-zinc-900">
                            {isLoading
                                ? "..."
                                : totalItems.toString().padStart(2, "0")}
                        </span>
                    </div>

                    <Link
                        to="/poll/create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-all active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                        Create Poll
                    </Link>
                </div>

                {/* Loading State Area (Only displays on initial load) */}
                {isLoading && !data && (
                    <div className="border-border/60 bg-card/20 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed p-12">
                        <LoadingAnimation />
                    </div>
                )}

                {/* Live Feed List Stack */}
                {(!isLoading || data) && (
                    <div
                        className={`space-y-4 transition-opacity duration-150 ${isPlaceholderData ? "pointer-events-none opacity-50" : "opacity-100"}`}
                    >
                        {polls.length > 0 ? (
                            <>
                                <div className="animate-in fade-in space-y-3.5 duration-200">
                                    {polls.map(poll => (
                                        <PollCard key={poll.id} poll={poll} />
                                    ))}
                                </div>

                                {/* Responsive Shadcn Pagination Component Block */}
                                {totalPages > 1 && (
                                    <div className="border-border/40 border-t pt-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                prev =>
                                                                    Math.max(
                                                                        prev -
                                                                            1,
                                                                        1
                                                                    )
                                                            )
                                                        }
                                                        className={`cursor-pointer ${!pagination?.hasPrevPage ? "pointer-events-none opacity-40" : ""}`}
                                                    />
                                                </PaginationItem>

                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, idx) => {
                                                        const pageNumber =
                                                            idx + 1;
                                                        if (
                                                            pageNumber === 1 ||
                                                            pageNumber ===
                                                                totalPages ||
                                                            Math.abs(
                                                                pageNumber -
                                                                    currentPage
                                                            ) <= 1
                                                        ) {
                                                            return (
                                                                <PaginationItem
                                                                    key={
                                                                        pageNumber
                                                                    }
                                                                >
                                                                    <PaginationLink
                                                                        isActive={
                                                                            currentPage ===
                                                                            pageNumber
                                                                        }
                                                                        onClick={() =>
                                                                            setCurrentPage(
                                                                                pageNumber
                                                                            )
                                                                        }
                                                                        className="cursor-pointer font-mono text-xs"
                                                                    >
                                                                        {
                                                                            pageNumber
                                                                        }
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            );
                                                        }
                                                        if (
                                                            pageNumber === 2 ||
                                                            pageNumber ===
                                                                totalPages - 1
                                                        ) {
                                                            return (
                                                                <PaginationItem
                                                                    key={
                                                                        pageNumber
                                                                    }
                                                                >
                                                                    <PaginationEllipsis />
                                                                </PaginationItem>
                                                            );
                                                        }
                                                        return null;
                                                    }
                                                )}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                prev =>
                                                                    Math.min(
                                                                        prev +
                                                                            1,
                                                                        totalPages
                                                                    )
                                                            )
                                                        }
                                                        className={`cursor-pointer ${!pagination?.hasNextPage ? "pointer-events-none opacity-40" : ""}`}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="border-muted-foreground/20 bg-muted/5 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                                <GlobeOff className="text-muted-foreground/60 mb-3 h-8 w-8" />
                                <p className="text-muted-foreground/80 text-sm font-medium tracking-tight">
                                    No active polls available
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
