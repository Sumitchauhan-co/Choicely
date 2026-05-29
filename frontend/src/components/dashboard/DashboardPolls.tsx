import { useState } from "react";

import { Link } from "@tanstack/react-router";
import {
    BarChart3,
    ChevronRight,
    Edit3,
    Globe,
    Lock,
    Clock,
    CheckCircle2,
    Copy,
    Trash2,
    Tag,
} from "lucide-react";
import { toast } from "sonner";

import EditPoll from "./EditPoll";
import { LoadingAnimation } from "../../shared/LoadingAnimation";

import { Button } from "@/components/ui/button";
import {
    useUserCreatedPolls,
    useUpdatePoll,
    useDeletePoll,
    type Poll,
} from "@/hooks/usePoll";
import { usePollSocket } from "@/hooks/usePoll";

export default function DashboardPolls() {
    const { data: myPolls, isLoading } = useUserCreatedPolls();
    const updatePollMutation = useUpdatePoll();
    const deletePollMutation = useDeletePoll();
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

    if (isLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <LoadingAnimation />
                <p className="text-accent-foreground font-mono text-xs">
                    Querying polls data...
                </p>
            </div>
        );
    }

    return (
        <section className="animate-in fade-in space-y-6 duration-200">
            <div>
                <h2 className="text-xl font-bold tracking-tight">
                    Poll Configuration
                </h2>
                <p className="text-muted-foreground mt-0.5 text-xs">
                    Edit questions, scopes, and target boundaries for live
                    rooms.
                </p>
            </div>

            {!myPolls || myPolls.length === 0 ? (
                <div className="bg-muted/10 mx-auto max-w-sm rounded-2xl border border-dashed p-12 text-center">
                    <BarChart3 className="text-muted-foreground/30 mx-auto mb-2.5 h-7 w-7" />
                    <h4 className="text-xs font-bold">
                        No active instances registered
                    </h4>
                </div>
            ) : (
                <div className="border-border/60 bg-card overflow-hidden rounded-xl border shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead className="bg-muted/40 text-muted-foreground border-b text-[10px] font-bold tracking-wide uppercase">
                                <tr>
                                    <th className="w-12 p-4 text-center">
                                        S.No.
                                    </th>
                                    <th className="p-4">Poll Name</th>
                                    <th className="p-4">Poll Question</th>
                                    <th className="p-4">Exposure Flags</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Votes Count</th>
                                    <th className="p-4">Share</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-foreground/80 divide-y font-medium">
                                {myPolls.map((poll, index) => (
                                    <PollTableRow
                                        key={poll.id}
                                        poll={poll}
                                        serialNumber={index + 1}
                                        setSelectedPoll={setSelectedPoll}
                                        deletePollMutation={deletePollMutation}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedPoll && (
                <EditPoll
                    poll={selectedPoll}
                    onClose={() => setSelectedPoll(null)}
                    mutation={updatePollMutation}
                />
            )}
        </section>
    );
}

interface PollTableRowProps {
    poll: Poll;
    serialNumber: number;
    setSelectedPoll: (poll: Poll) => void;
    deletePollMutation: ReturnType<typeof useDeletePoll>;
}

function PollTableRow({
    poll,
    serialNumber,
    setSelectedPoll,
    deletePollMutation,
}: PollTableRowProps) {
    const { liveMetrics } = usePollSocket(poll.id);
    const [currentTimestamp] = useState(() => Date.now());

    const isExpired = poll.expiresAt
        ? new Date(poll.expiresAt).getTime() < currentTimestamp
        : false;

    const totalVotes = liveMetrics ? liveMetrics.totalVotes : 0;

    const handleCopyLink = (pollId: string) => {
        const url = `${window.location.origin}/poll/${pollId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
    };

    return (
        <tr
            className={`transition-colors ${
                isExpired
                    ? "bg-muted/5 hover:bg-muted/10 opacity-75"
                    : "hover:bg-muted/20"
            }`}
        >
            {/* Column 1: S.No. identifier */}
            <td className="text-muted-foreground/70 p-4 text-center font-mono text-[11px] font-bold">
                {serialNumber}
            </td>

            {/* Column 2: Completely distinct Poll Name column */}
            <td className="p-4 whitespace-nowrap">
                {poll.name ? (
                    <div className="text-primary dark:text-primary/90 bg-primary/5 border-primary/10 shadow-3xs inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-sans font-bold">
                        <Tag className="h-2.5 w-2.5 shrink-0" />
                        <span className="text-[10px] tracking-tight uppercase">
                            {poll.name}
                        </span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/40 text-[11px] font-normal italic">
                        No handle set
                    </span>
                )}
            </td>

            {/* Column 3: Dedicated Poll Question column */}
            <td className="max-w-xs p-4 sm:max-w-md">
                <div
                    className={`text-foreground truncate font-semibold ${
                        isExpired &&
                        "text-muted-foreground decoration-muted-foreground/30 line-through"
                    }`}
                >
                    {poll.question}
                </div>
                <div className="text-muted-foreground/50 mt-0.5 truncate font-mono text-[10px]">
                    ID: {poll.id}
                </div>
            </td>

            <td className="p-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                        poll.isPublic
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                    }`}
                >
                    {poll.isPublic ? (
                        <Globe className="h-2.5 w-2.5" />
                    ) : (
                        <Lock className="h-2.5 w-2.5" />
                    )}
                    {poll.isPublic ? "Public" : "Private"}
                </span>
            </td>

            <td className="p-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                        isExpired
                            ? "bg-destructive/10 text-destructive dark:bg-destructive/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                >
                    {isExpired ? (
                        <Clock className="h-2.5 w-2.5" />
                    ) : (
                        <CheckCircle2 className="h-2.5 w-2.5" />
                    )}
                    {isExpired ? "Expired" : "Active"}
                </span>
            </td>

            <td className="text-foreground p-4 font-mono text-[11px] font-bold whitespace-nowrap">
                <span className="bg-primary/10 text-primary rounded-md px-2 py-1">
                    {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                </span>
            </td>

            <td className="p-4 whitespace-nowrap">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyLink(poll.id)}
                    className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-pointer rounded-lg"
                    title="Copy link"
                >
                    <Copy className="h-3.5 w-3.5" />
                </Button>
            </td>

            <td className="p-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                    {isExpired ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className="text-muted-foreground/40 h-8 w-8 cursor-not-allowed rounded-lg"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Link
                            to="/poll/$pollId"
                            params={{
                                pollId: poll.id,
                            }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        disabled={isExpired}
                        onClick={() => setSelectedPoll(poll)}
                        className="h-8 cursor-pointer gap-1 rounded-lg text-[11px] font-bold shadow-2xs disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Edit3 className="h-3 w-3" />
                        Edit Rules
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={deletePollMutation.isPending}
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this poll?"
                                )
                            ) {
                                deletePollMutation.mutate({
                                    pollId: poll.id,
                                });
                            }
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 cursor-pointer rounded-lg p-0 transition-colors"
                        title="Delete Poll"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
