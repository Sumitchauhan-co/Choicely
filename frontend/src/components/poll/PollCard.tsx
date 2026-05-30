import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Tag } from "lucide-react";

import { useUserProfile } from "@/hooks/useAuth";
import { usePollSocket, type Poll } from "@/hooks/usePoll";

interface PollCardItemProps {
    poll: Poll;
}

export function PollCard({ poll }: PollCardItemProps) {
    const { data: creator } = useUserProfile(poll.creatorId);

    const [now, setNow] = useState(() => Date.now());

    const { liveMetrics } = usePollSocket(poll.id);

    const totalVotes = liveMetrics ? liveMetrics.totalVotes : 0;

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const hasExpiration = !!poll.expiresAt;
    const expiryDate = hasExpiration ? new Date(poll.expiresAt!) : null;
    const isExpired = expiryDate ? expiryDate.getTime() <= now : false;

    const getRelativeDisplayString = (targetDate: Date) => {
        const diffMs = targetDate.getTime() - now;
        if (diffMs <= 0) return "Expired";

        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (days > 0) return `Closes in ${days}d ${hours}h`;
        if (hours > 0) return `Closes in ${hours}h ${minutes}m`;
        return `Closes in ${totalSeconds % 60}s`;
    };

    return (
        <Link
            to="/poll/$pollId"
            params={{ pollId: poll.id }}
            className="group bg-card text-card-foreground border-border/80 hover:border-primary/60 dark:hover:border-primary/40 block rounded-xl border p-5 shadow-xs transition-all duration-200"
        >
            <div className="flex flex-col space-y-4">
                {/* 1. Header Layout Row adjusted with your requested justify-between & flex-wrap alignments */}
                <div className="flex justify-between gap-3 text-xs">
                    {/* Left Meta Group */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center justify-center gap-2">
                            <div className="bg-primary/10 text-primary border-primary/20 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase select-none">
                                {creator?.firstName
                                    ? creator.firstName.charAt(0)
                                    : "."}
                            </div>
                            <span className="text-foreground/80 group-hover:text-foreground max-w-[120px] truncate font-semibold tracking-tight transition-colors sm:max-w-[160px]">
                                {creator
                                    ? `${creator.firstName} ${creator.lastName}`
                                    : "loading..."}
                            </span>
                        </div>

                        {/* Styled Poll Identifier Badge */}
                        {poll.name && (
                            <div className="bg-secondary text-secondary-foreground border-border/60 inline-flex max-w-[100px] shrink-0 items-center gap-1 truncate rounded-md border px-2 py-0.5 select-none sm:max-w-[140px]">
                                <Tag className="text-muted-foreground h-2.5 w-2.5 shrink-0" />
                                <span className="truncate font-sans text-[10px] font-bold tracking-tight uppercase">
                                    {poll.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right Metrics & Countdown Group pushed to the opposite side */}
                    <div className="flex flex-wrap justify-end gap-3 sm:gap-4">
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-600 tabular-nums shadow-2xs dark:text-emerald-400">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            </span>
                            Votes: {totalVotes}
                        </div>

                        {hasExpiration && expiryDate && (
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide transition-colors select-none ${
                                        isExpired
                                            ? "bg-destructive/10 text-destructive border-destructive/20"
                                            : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    }`}
                                >
                                    <Clock className="h-3 w-3" />
                                    {isExpired
                                        ? "Expired"
                                        : getRelativeDisplayString(expiryDate)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Main Question Block layout kept uniform with modern gap metrics */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-foreground/90 font-sans text-base leading-snug font-semibold tracking-tight transition-colors">
                        {poll.question}
                    </h3>
                    <div className="mt-1 shrink-0 translate-x-0 transform p-1.5 opacity-40 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                        <ArrowUpRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
