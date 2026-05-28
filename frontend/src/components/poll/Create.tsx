import { useState } from "react";

import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import {
    Plus,
    Trash2,
    BarChart3,
    HelpCircle,
    Clock2Icon,
    Globe,
    Lock,
    Tag,
} from "lucide-react";
import { toast } from "sonner";

import { useCreatePoll } from "../../hooks/usePoll";
import { Button } from "../ui/button";
import { LiveCountdown } from "./utils/LiveCountdown";

type TimeUnit = "seconds" | "minutes" | "hours";

const PRESETS = [
    { label: "30s", minutes: 0.5 },
    { label: "1m", minutes: 1 },
    { label: "5m", minutes: 5 },
    { label: "15m", minutes: 15 },
    { label: "30m", minutes: 30 },
    { label: "1h", minutes: 60 },
    { label: "1d", minutes: 1440 },
] as const;

const UNIT_MULTIPLIERS: Record<TimeUnit, number> = {
    seconds: 1 / 60,
    minutes: 1,
    hours: 60,
};

const INITIAL_DEFAULT_EXPIRY = new Date(
    Date.now() + 24 * 60 * 60 * 1000
).toISOString();

export default function CreatePoll() {
    const navigate = useNavigate();
    const createPollMutation = useCreatePoll();

    const [durationMinutes, setDurationMinutes] = useState<number | null>(1440);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [customUnit, setCustomUnit] = useState<TimeUnit>("minutes");

    const form = useForm({
        defaultValues: {
            question: "",
            name: "",
            options: ["", ""],
            expiresAt: INITIAL_DEFAULT_EXPIRY,
            isPublic: true,
        },
        onSubmit: async ({ value }) => {
            const cleanOptions = value.options
                .map(opt => opt.trim())
                .filter(opt => opt !== "");

            if (cleanOptions.length < 2) {
                toast.error("You must provide at least 2 options");
                return;
            }

            if (cleanOptions.length > 10) {
                toast.error("You can provide a maximum of 10 options");
                return;
            }

            toast.promise(
                createPollMutation.mutateAsync({
                    question: value.question.trim(),
                    name: value.name.trim(),
                    options: cleanOptions,
                    expiresAt: value.expiresAt
                        ? new Date(value.expiresAt).toISOString()
                        : undefined,
                    isPublic: value.isPublic,
                    isActive: true,
                    allowMultipleVotes: false,
                }),
                {
                    loading: "Creating your poll...",
                    success: data => {
                        const pollId = data?.id;
                        if (pollId) {
                            navigate({ to: `/poll/${pollId}` });
                        } else {
                            navigate({ to: "/dashboard" });
                        }
                        return "Poll created successfully!";
                    },
                    error: err => `${err.message}`,
                }
            );
        },
    });

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4 md:p-8">
            <div className="bg-card text-card-foreground border-border w-full max-w-2xl space-y-6 rounded-2xl border p-6 shadow-xl md:p-8">
                <div className="border-border flex items-center gap-3 border-b pb-4">
                    <div className="bg-primary/10 text-primary rounded-xl p-2.5">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-sans text-2xl font-bold tracking-tight">
                            Create a New Poll
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Ask a question and let your community cast their
                            votes.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    <form.Field
                        name="name"
                        validators={{
                            onChange: ({ value }) => {
                                const trimmed = value.trim();
                                if (!trimmed)
                                    return "A poll identifier name is required";
                                if (trimmed.length < 1)
                                    return "Name must be at least 1 character long";
                                if (trimmed.length > 20)
                                    return "Name cannot exceed 20 characters";
                                return undefined;
                            },
                        }}
                    >
                        {field => (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label
                                            htmlFor={field.name}
                                            className="text-foreground flex items-center gap-1.5 text-sm font-semibold tracking-wide"
                                        >
                                            <Tag className="text-muted-foreground h-4 w-4" />
                                            Poll Name
                                        </label>
                                        <p className="text-muted-foreground mt-0.5 text-xs">
                                            Try to give a unique name for your
                                            Convenience
                                        </p>
                                    </div>
                                    <span
                                        className={`mt-1 self-start text-xs ${field.state.value.length > 20 ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                                    >
                                        {field.state.value.length}/20
                                    </span>
                                </div>
                                <input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={e =>
                                        field.handleChange(e.target.value)
                                    }
                                    maxLength={25}
                                    placeholder="e.g., Tech Stack Survey"
                                    className={`bg-secondary text-secondary-foreground focus:ring-ring/40 w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:ring-2 focus:outline-hidden ${
                                        field.state.meta.isTouched &&
                                        field.state.meta.errors.length
                                            ? "border-destructive/60 focus:ring-destructive/20"
                                            : "border-border"
                                    }`}
                                />
                                {field.state.meta.isTouched &&
                                field.state.meta.errors.length ? (
                                    <p className="text-destructive animate-in fade-in text-xs font-medium duration-150">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="question"
                        validators={{
                            onChange: ({ value }) => {
                                const trimmed = value.trim();
                                if (!trimmed)
                                    return "A poll question is required";
                                if (trimmed.length < 3)
                                    return "Question must be at least 3 characters long";
                                if (trimmed.length > 500)
                                    return "Question is too long";
                                return undefined;
                            },
                        }}
                    >
                        {field => (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor={field.name}
                                        className="flex items-center gap-1.5 text-sm font-semibold tracking-wide"
                                    >
                                        <HelpCircle className="text-muted-foreground h-4 w-4" />
                                        Your Question
                                    </label>
                                    <span
                                        className={`text-xs ${field.state.value.length > 500 ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                                    >
                                        {field.state.value.length}/500
                                    </span>
                                </div>
                                <input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={e =>
                                        field.handleChange(e.target.value)
                                    }
                                    maxLength={510}
                                    placeholder="e.g., What is your favorite poll management tool?"
                                    className={`bg-secondary text-secondary-foreground focus:ring-ring/40 w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:ring-2 focus:outline-hidden ${
                                        field.state.meta.isTouched &&
                                        field.state.meta.errors.length
                                            ? "border-destructive/60 focus:ring-destructive/20"
                                            : "border-border"
                                    }`}
                                />
                                {field.state.meta.isTouched &&
                                field.state.meta.errors.length ? (
                                    <p className="text-destructive animate-in fade-in text-xs font-medium duration-150">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    {/* New Poll Name Field Entry */}

                    <div className="space-y-3">
                        <form.Field
                            name="options"
                            mode="array"
                            validators={{
                                onChange: ({ value }) => {
                                    if (value.length < 2)
                                        return "You must provide at least 2 options";
                                    if (value.length > 10)
                                        return "You can provide a maximum of 10 options";
                                    return undefined;
                                },
                            }}
                        >
                            {field => (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-semibold tracking-wide">
                                            Poll Options
                                        </label>
                                        <span
                                            className={`text-xs ${field.state.value.length >= 10 ? "font-medium text-amber-500" : "text-muted-foreground"}`}
                                        >
                                            {field.state.value.length}/10
                                            Options
                                        </span>
                                    </div>

                                    {field.state.value.map((_, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 duration-150">
                                                <input
                                                    value={
                                                        field.state.value[index]
                                                    }
                                                    placeholder={`${index + 1 === 1 ? `#1 Choicely!` : `#${index + 1}`} `}
                                                    onChange={e => {
                                                        const updatedOptions = [
                                                            ...field.state
                                                                .value,
                                                        ];
                                                        updatedOptions[index] =
                                                            e.target.value;
                                                        field.handleChange(
                                                            updatedOptions
                                                        );
                                                    }}
                                                    className="bg-secondary text-secondary-foreground border-border focus:ring-ring/40 w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:ring-2 focus:outline-hidden"
                                                />
                                                {field.state.value.length >
                                                    2 && (
                                                    <button
                                                        title="Delete option"
                                                        type="button"
                                                        onClick={() => {
                                                            const updatedOptions =
                                                                field.state.value.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index
                                                                );
                                                            field.handleChange(
                                                                updatedOptions
                                                            );
                                                        }}
                                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 cursor-pointer rounded-lg border border-transparent p-2.5 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {field.state.meta.errors.length ? (
                                        <p className="text-destructive text-xs font-medium">
                                            {field.state.meta.errors.join(", ")}
                                        </p>
                                    ) : null}

                                    {field.state.value.length < 10 ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                field.handleChange([
                                                    ...field.state.value,
                                                    "",
                                                ])
                                            }
                                            className="border-border hover:border-primary/60 text-muted-foreground hover:text-primary bg-secondary/20 hover:bg-primary/5 mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.99]"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Option Choice
                                        </button>
                                    ) : (
                                        <p className="text-muted-foreground/70 bg-secondary/40 border-border/40 rounded-lg border border-dashed py-2 text-center text-xs">
                                            Maximum tier allocation limit
                                            reached (10 Choices max).
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <form.Field name="expiresAt">
                        {field => {
                            const currentFieldValue = field.state.value;

                            const applyMinutesDuration = (
                                totalMins: number
                            ) => {
                                if (totalMins <= 0) {
                                    setDurationMinutes(null);
                                    field.handleChange("");
                                    return;
                                }
                                setDurationMinutes(totalMins);
                                const targetDate = new Date(
                                    Date.now() + totalMins * 60 * 1000
                                );
                                field.handleChange(targetDate.toISOString());
                            };

                            const handleSetDefault = () => {
                                setCustomAmount("");
                                setDurationMinutes(1440);
                                const targetDate = new Date(
                                    Date.now() + 24 * 60 * 60 * 1000
                                );
                                field.handleChange(targetDate.toISOString());
                            };

                            return (
                                <div className="border-border/80 space-y-4 rounded-xl border bg-transparent p-5">
                                    <div className="border-border/50 flex flex-col justify-between gap-2 border-b pb-3 sm:flex-row sm:items-center">
                                        <label className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-wide">
                                            <Clock2Icon className="text-primary h-4 w-4" />
                                            Poll Expiry
                                        </label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSetDefault}
                                            className="border-border hover:bg-secondary/60 h-8 cursor-pointer self-start rounded-lg px-3 text-xs font-medium transition-colors sm:self-center"
                                        >
                                            Set Default
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-wrap gap-2">
                                            {PRESETS.map(preset => {
                                                const isPresetActive =
                                                    durationMinutes ===
                                                    preset.minutes;
                                                return (
                                                    <Button
                                                        key={preset.label}
                                                        type="button"
                                                        variant={
                                                            isPresetActive
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className={`h-10 rounded-xl border px-4 text-sm font-medium transition-all ${
                                                            isPresetActive
                                                                ? "bg-primary border-primary text-primary-foreground shadow-primary/20 scale-[1.02] shadow-md"
                                                                : "border-border hover:bg-secondary/60 text-foreground bg-transparent"
                                                        }`}
                                                        onClick={() => {
                                                            setCustomAmount("");
                                                            applyMinutesDuration(
                                                                preset.minutes
                                                            );
                                                        }}
                                                    >
                                                        {preset.label}
                                                    </Button>
                                                );
                                            })}
                                        </div>

                                        <div className="w-full max-w-xs space-y-1.5">
                                            <p className="text-muted-foreground pl-1 text-[11px] font-semibold tracking-wider uppercase">
                                                Customise
                                            </p>
                                            <div className="border-border focus-within:ring-primary/20 focus-within:border-primary/60 flex items-center gap-1.5 rounded-xl border bg-transparent p-1 transition-all focus-within:ring-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="_ _"
                                                    value={customAmount}
                                                    onChange={e => {
                                                        const val =
                                                            e.target.value;
                                                        setCustomAmount(val);
                                                        const amount = parseInt(
                                                            val,
                                                            10
                                                        );
                                                        if (
                                                            !isNaN(amount) &&
                                                            amount > 0
                                                        ) {
                                                            setDurationMinutes(
                                                                null
                                                            );
                                                            applyMinutesDuration(
                                                                amount *
                                                                    UNIT_MULTIPLIERS[
                                                                        customUnit
                                                                    ]
                                                            );
                                                        }
                                                    }}
                                                    className="text-foreground placeholder:text-muted-foreground/60 h-9 w-24 border-0 bg-transparent px-2 text-sm font-medium focus:ring-0 focus:outline-hidden"
                                                />
                                                <div className="bg-border/80 h-4 w-px" />
                                                <select
                                                    title="Time Unit Selector"
                                                    value={customUnit}
                                                    onChange={e => {
                                                        const unit = e.target
                                                            .value as TimeUnit;
                                                        setCustomUnit(unit);
                                                        const amount = parseInt(
                                                            customAmount,
                                                            10
                                                        );
                                                        if (
                                                            !isNaN(amount) &&
                                                            amount > 0
                                                        ) {
                                                            applyMinutesDuration(
                                                                amount *
                                                                    UNIT_MULTIPLIERS[
                                                                        unit
                                                                    ]
                                                            );
                                                        }
                                                    }}
                                                    className="text-foreground [&>option]:bg-card [&>option]:text-card-foreground h-9 flex-1 cursor-pointer border-0 bg-transparent px-1 text-xs font-semibold focus:ring-0 focus:outline-hidden"
                                                >
                                                    <option value="seconds">
                                                        Seconds
                                                    </option>
                                                    <option value="minutes">
                                                        Minutes
                                                    </option>
                                                    <option value="hours">
                                                        Hours
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {currentFieldValue && (
                                        <div className="border-primary/10 bg-primary/5 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2 rounded-xl border px-4 py-3 duration-200">
                                            <div className="flex items-center justify-start gap-2.5">
                                                <div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                                                <p className="text-muted-foreground text-xs leading-relaxed">
                                                    <LiveCountdown
                                                        targetIsoString={
                                                            currentFieldValue
                                                        }
                                                    />
                                                </p>
                                            </div>
                                            <div className="text-muted-foreground/70 border-border/60 border-l pl-4 text-[10px]">
                                                Closes precisely at{" "}
                                                <span className="text-foreground font-semibold">
                                                    {new Date(
                                                        currentFieldValue
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })}
                                                </span>{" "}
                                                on{" "}
                                                <span className="text-foreground font-semibold">
                                                    {new Date(
                                                        currentFieldValue
                                                    ).toLocaleDateString([], {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {field.state.meta.isTouched &&
                                    field.state.meta.errors.length ? (
                                        <div className="text-destructive bg-destructive/5 border-destructive/10 animate-in fade-in rounded-lg border px-3 py-2 text-xs font-medium duration-150">
                                            {field.state.meta.errors.join(", ")}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        }}
                    </form.Field>

                    <form.Field name="isPublic">
                        {field => (
                            <div className="space-y-2 pt-2">
                                <label className="text-foreground/90 block text-sm font-semibold tracking-wide">
                                    Poll Visibility
                                </label>

                                <div className="bg-secondary border-border/80 relative inline-flex w-full max-w-xs rounded-xl border p-1 select-none sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => field.handleChange(true)}
                                        className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 sm:flex-initial ${
                                            field.state.value === true
                                                ? "bg-background text-primary border-border/40 border shadow-xs"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <Globe
                                            className={`h-4 w-4 transition-transform ${field.state.value === true ? "scale-105" : ""}`}
                                        />
                                        <span>Public</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            field.handleChange(false)
                                        }
                                        className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 sm:flex-initial ${
                                            field.state.value === false
                                                ? "bg-background text-destructive border-border/40 border shadow-xs"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <Lock
                                            className={`h-4 w-4 transition-transform ${field.state.value === false ? "scale-105" : ""}`}
                                        />
                                        <span>Private</span>
                                    </button>
                                </div>

                                <p className="text-muted-foreground/80 text-xs leading-relaxed tracking-tight">
                                    {field.state.value
                                        ? "Anyone on the global web stream network can find and answer this poll entry."
                                        : "Only users explicitly holding the target URL signature index can cast votes."}
                                </p>
                            </div>
                        )}
                    </form.Field>

                    <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>

                        <form.Subscribe
                            selector={state => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <button
                                    type="submit"
                                    disabled={
                                        !canSubmit ||
                                        isSubmitting ||
                                        createPollMutation.isPending
                                    }
                                    className="bg-primary text-primary-foreground cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {createPollMutation.isPending ||
                                    isSubmitting
                                        ? "Creating..."
                                        : "Create Poll"}
                                </button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>
            </div>
        </div>
    );
}
