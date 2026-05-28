import { useState } from "react";

import { useParams, Link } from "@tanstack/react-router";
import {
    BarChart3,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    Tag,
} from "lucide-react";
import { toast } from "sonner";

import {
    useCastVote,
    useGetPollById,
    usePollSocket,
} from "../../hooks/usePoll";

export default function LivePoll() {
    const { pollId } = useParams({ from: "/_appLayout/poll/$pollId" });
    const {
        data: poll,
        isLoading: isQueryLoading,
        error: queryError,
    } = useGetPollById(pollId);
    const { liveMetrics } = usePollSocket(pollId);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const totalVotes = liveMetrics ? liveMetrics.totalVotes : 0;

    const { mutate: castVote } = useCastVote({
        onSuccess: () => {
            setHasVoted(true);
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });

    const handleVoteSubmission = () => {
        if (!selectedOption) {
            toast.error("Please choose an option first!");
            return;
        }

        setIsSubmitting(true);

        castVote({ pollId, option: selectedOption });
    };

    const getVotesForOption = (optionText: string) => {
        if (!liveMetrics) return 0;
        const record = liveMetrics.distribution.find(
            item => item.option === optionText
        );
        return record ? record.votesCount : 0;
    };

    // Loading State
    if (isQueryLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <p className="text-muted-foreground animate-pulse text-sm font-medium">
                    Syncing real-time room...
                </p>
            </div>
        );
    }

    // Error State
    if (queryError || !poll) {
        return (
            <div className="border-destructive/30 bg-destructive/5 mx-auto my-12 max-w-md rounded-xl border border-dashed p-8 text-center">
                <p className="text-destructive mb-4 text-sm font-medium">
                    Could not open or trace this poll data link context
                </p>
                <Link
                    to="/"
                    className="text-primary inline-flex items-center gap-2 text-xs font-semibold hover:underline"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen px-4 py-12 antialiased sm:px-6">
            <div className="mx-auto max-w-xl space-y-6">
                {/* Back Navigation Bar */}
                <Link
                    to="/poll"
                    className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-2 text-xs font-medium transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5 transform transition-transform group-hover:-translate-x-0.5" />
                    Back to Feed
                </Link>

                {/* Main Card */}
                <div className="bg-card text-card-foreground border-border/70 space-y-6 rounded-2xl border p-6 shadow-xs sm:p-8">
                    {/* Header Row Meta Info Layout Container */}
                    <div className="flex items-center justify-between gap-4 select-none">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-sans">
                                Live Interaction Room
                            </span>
                        </div>
                        <div className="bg-secondary text-secondary-foreground border-border/60 inline-flex max-w-[180px] items-center gap-1.5 rounded-md border px-2.5 py-1 sm:max-w-[240px]">
                            <Tag className="text-muted-foreground h-3 w-3 shrink-0" />
                            <span className="truncate font-sans text-[11px] font-bold tracking-tight uppercase">
                                {poll.name}
                            </span>
                        </div>
                    </div>

                    {/* Question Title */}
                    <h1 className="text-foreground/90 font-sans text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                        {poll.question}
                    </h1>

                    {/* Option Choices Stack Container */}
                    <div className="space-y-3.5">
                        {poll.options.map((optionText: string) => {
                            const voteCount = getVotesForOption(optionText);
                            const percentage =
                                totalVotes > 0
                                    ? Math.round((voteCount / totalVotes) * 100)
                                    : 0;
                            const isCurrentSelection =
                                selectedOption === optionText;

                            return (
                                <button
                                    key={optionText}
                                    type="button"
                                    disabled={hasVoted || isSubmitting}
                                    onClick={() =>
                                        setSelectedOption(optionText)
                                    }
                                    className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-hidden active:scale-[0.99] ${
                                        isCurrentSelection
                                            ? "border-primary bg-primary/[0.02]"
                                            : "border-border/80 hover:border-primary/40 bg-background/50"
                                    } ${hasVoted ? "cursor-default active:scale-100" : ""}`}
                                >
                                    {/* Real-time calculated visual gauge filler background */}
                                    {hasVoted && (
                                        <div
                                            className="bg-primary/8 dark:bg-primary/12 absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    )}

                                    <div className="relative flex items-center justify-between gap-4 text-sm font-medium">
                                        <div className="flex items-center gap-3 truncate">
                                            {/* Custom Radio/Check Circle Indicators */}
                                            <div
                                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                                    isCurrentSelection
                                                        ? "border-primary bg-primary"
                                                        : "border-muted-foreground/40"
                                                }`}
                                            >
                                                {isCurrentSelection && (
                                                    <div className="bg-primary-foreground h-1.5 w-1.5 rounded-full" />
                                                )}
                                            </div>
                                            <span className="text-foreground/80 group-hover:text-foreground truncate font-sans transition-colors">
                                                {optionText}
                                            </span>
                                        </div>

                                        {/* Display dynamic counting values alongside percentages once user has submitted a choice */}
                                        {hasVoted && (
                                            <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                                                {voteCount} ({percentage}%)
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Button Segment */}
                    {!hasVoted ? (
                        <button
                            type="button"
                            disabled={!selectedOption || isSubmitting}
                            onClick={handleVoteSubmission}
                            className="bg-primary text-primary-foreground inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-sans text-sm font-semibold tracking-tight shadow-sm transition-all hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Recording Choice...
                                </>
                            ) : (
                                "Cast Your Vote"
                            )}
                        </button>
                    ) : (
                        <div className="animate-fade-in flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 font-sans text-xs font-semibold text-emerald-600 select-none dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                            Your selection has been locked into the real-time
                            grid
                        </div>
                    )}

                    {/* Footer Running Live Summary Tracker */}
                    <div className="border-border/50 text-muted-foreground/70 flex items-center justify-between border-t pt-4 font-mono text-xs font-semibold select-none">
                        <span className="inline-flex items-center gap-1.5">
                            <BarChart3 className="text-muted-foreground/50 h-3.5 w-3.5" />
                            Total Collective Submissions
                        </span>
                        <span className="bg-muted border-border/40 text-foreground/80 rounded-md border px-2 py-0.5 font-bold tabular-nums">
                            {totalVotes.toString().padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
