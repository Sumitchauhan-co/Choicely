import * as React from "react";
import { useState } from "react";

import { type UseMutationResult } from "@tanstack/react-query";
import {
    X,
    Calendar,
    Check,
    Loader2,
    Globe,
    Lock,
    Plus,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Poll } from "@/hooks/usePoll";

interface EditPollModalProps {
    poll: Poll;
    onClose: () => void;
    mutation: UseMutationResult<
        { updatedData: Partial<Poll>; onClose?: () => void },
        Error,
        { pollId: string; data: Partial<Poll>; onClose?: () => void }
    >;
}

export default function EditPollModal({
    poll,
    onClose,
    mutation,
}: EditPollModalProps) {
    const [question, setQuestion] = useState(poll.question);
    const [isPublic, setIsPublic] = useState(poll.isPublic);
    const [options, setOptions] = useState<string[]>([...poll.options]);
    const [expiryDateTimeInput, setExpiryDateTimeInput] = useState(
        poll.expiresAt
            ? new Date(poll.expiresAt).toISOString().slice(0, 16)
            : ""
    );

    const handleOptionChange = (index: number, val: string) => {
        const next = [...options];
        next[index] = val;
        setOptions(next);
    };

    const addOptionRow = () => setOptions([...options, ""]);
    const removeOptionRow = (index: number) =>
        setOptions(options.filter((_, i) => i !== index));

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Partial<Poll> = {
            question,
            isPublic,
            options: options.filter(o => o.trim() !== ""),
            expiresAt: expiryDateTimeInput
                ? new Date(expiryDateTimeInput).toISOString()
                : "",
        };

        mutation.mutate({
            pollId: poll.id,
            data: payload,
            onClose: onClose,
        });
    };

    return (
        <div className="bg-background/80 animate-in fade-in fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs duration-100">
            <div className="bg-card animate-in scale-in-95 scrollbar-none relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border p-6 shadow-xl duration-150">
                <button
                    title="close"
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 cursor-pointer rounded-lg p-1.5"
                >
                    <X className="h-4 w-4" />
                </button>

                <h3 className="text-base font-bold tracking-tight">
                    Configure Active Poll
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                    Commit real-time configuration variables to data registers.
                </p>

                <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                            Question / Header Title
                        </label>
                        <input
                            title="question"
                            type="text"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            required
                            className="bg-background focus:ring-primary focus:border-primary h-10 w-full rounded-xl border px-3 text-xs font-medium focus:ring-1 focus:outline-hidden"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                Poll Options
                            </label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={addOptionRow}
                                className="text-primary h-6 gap-1 rounded-md px-2 text-[10px] font-bold"
                            >
                                <Plus className="h-3 w-3" /> Add Choice
                            </Button>
                        </div>
                        <div className="space-y-1.5">
                            {options.map((opt, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={e =>
                                            handleOptionChange(
                                                i,
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder={`Choice Option #${i + 1}`}
                                        className="bg-background focus:ring-primary focus:border-primary h-9 w-full rounded-xl border px-3 text-xs font-medium focus:ring-1 focus:outline-hidden"
                                    />
                                    {options.length > 2 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeOptionRow(i)}
                                            className="text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0 rounded-xl"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                            <Calendar className="h-3 w-3" />
                            Adjusted Expiration Time Boundary
                        </label>
                        <input
                            title="time"
                            type="datetime-local"
                            value={expiryDateTimeInput}
                            onChange={e =>
                                setExpiryDateTimeInput(e.target.value)
                            }
                            className="bg-background focus:ring-primary focus:border-primary h-10 w-full rounded-xl border px-3 text-xs font-medium focus:ring-1 focus:outline-hidden"
                        />
                    </div>

                    <div className="bg-muted/20 flex items-center justify-between rounded-xl border p-3">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-xs font-bold">
                                {isPublic ? (
                                    <Globe className="text-primary h-3.5 w-3.5" />
                                ) : (
                                    <Lock className="text-muted-foreground h-3.5 w-3.5" />
                                )}
                                Broadcast to Public Channels
                            </div>
                        </div>
                        <button
                            title="visibility"
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                                isPublic ? "bg-primary" : "bg-muted"
                            }`}
                        >
                            <span
                                className={`bg-background pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-xs transition duration-200 ${
                                    isPublic ? "translate-x-4" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t pt-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={mutation.isPending}
                            className="h-9 cursor-pointer rounded-xl text-xs font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="h-9 cursor-pointer gap-1 rounded-xl text-xs font-bold"
                        >
                            {mutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            )}
                            <span>Save Alterations</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
