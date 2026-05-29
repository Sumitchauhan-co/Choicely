import { useForm } from "@tanstack/react-form";
import { useSearch } from "@tanstack/react-router";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
    const { mutateAsync: ResetPasswordMutating, isPending: isSubmitting } =
        useResetPassword();

    // Captures individual token value string safely out of the client browser address bar context
    const { token } = useSearch({ from: "/_appLayout/reset-password" }) as {
        token: string;
    };

    const form = useForm({
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            if (!token) {
                toast.error(
                    "Invalid verification parameters. Missing token key entry."
                );
                return;
            }

            // Core logic fallback blocker to prevent empty submissions
            if (
                !value.newPassword ||
                !value.confirmPassword ||
                value.newPassword !== value.confirmPassword
            ) {
                return;
            }

            ResetPasswordMutating({
                newPassword: value.newPassword,
                confirmPassword: value.confirmPassword,
                token: token,
            });
            form.reset();
        },
    });

    return (
        <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
            {/* Premium Ambient Background Grids & Flairs */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)]" />
            <div className="bg-primary/10 dark:bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-[450px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl" />

            {/* Container Block */}
            <div className="border-border/80 bg-card/90 dark:bg-card/70 hover:border-primary/20 relative w-full max-w-md space-y-8 rounded-2xl border p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_22px_55px_rgba(var(--primary),0.05)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
                {/* Header Context */}
                <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="bg-primary/10 text-primary ring-primary/5 flex h-13 w-13 items-center justify-center rounded-full shadow-[0_0_20px_rgba(var(--primary),0.15)] ring-4">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Reset Password
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-xs text-xs leading-relaxed font-medium sm:text-sm">
                            Please type a strong password.
                        </p>
                    </div>
                </div>

                {/* Form Elements */}
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    {/* New Password input module */}
                    <form.Field
                        name="newPassword"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value) {
                                    return "Password is required";
                                }
                                if (value.length < 8) {
                                    return "Password must be at least 8 characters long";
                                }
                                return undefined;
                            },
                        }}
                    >
                        {field => (
                            <div className="space-y-2">
                                <Label
                                    htmlFor={field.name}
                                    className="text-foreground/90 text-sm font-semibold tracking-wide"
                                >
                                    New Password
                                </Label>
                                <div className="group relative">
                                    <Lock className="text-muted-foreground/60 group-focus-within:text-primary absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={e =>
                                            field.handleChange(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="border-border/80 bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11 rounded-xl pr-4 pl-10.5 text-sm font-medium transition-all"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {(field.state.meta.isTouched ||
                                    form.state.isSubmitted) &&
                                field.state.meta.errors.length ? (
                                    <p className="text-destructive animate-fade-in pl-1 text-xs font-semibold">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    {/* Confirm Password input module */}
                    <form.Field
                        name="confirmPassword"
                        validators={{
                            onChange: ({ value, fieldApi }) => {
                                if (!value) {
                                    return "Please confirm your password";
                                }
                                // Access the main password value dynamically to check for matching
                                if (
                                    value !==
                                    fieldApi.form.getFieldValue("newPassword")
                                ) {
                                    return "Passwords do not match";
                                }
                                return undefined;
                            },
                        }}
                    >
                        {field => (
                            <div className="space-y-2">
                                <Label
                                    htmlFor={field.name}
                                    className="text-foreground/90 text-sm font-semibold tracking-wide"
                                >
                                    Confirm Password
                                </Label>
                                <div className="group relative">
                                    <Lock className="text-muted-foreground/60 group-focus-within:text-primary absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={e =>
                                            field.handleChange(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="border-border/80 bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11 rounded-xl pr-4 pl-10.5 text-sm font-medium transition-all"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {(field.state.meta.isTouched ||
                                    form.state.isSubmitted) &&
                                field.state.meta.errors.length ? (
                                    <p className="text-destructive animate-fade-in pl-1 text-xs font-semibold">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    {/* Upscaled Premium Action Button */}
                    <Button
                        type="submit"
                        className="shadow-primary/10 hover:shadow-primary/15 mt-2 h-11 w-full rounded-xl text-sm font-bold tracking-wide shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating data keys...
                            </>
                        ) : (
                            "Save New Password"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
