import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Blocks, Mail, Lock, ArrowRight, User } from "lucide-react";

import { useSignup } from "../../hooks/useAuth";

import GoogleIcon from "@/assets/google.svg";
import { AuthBanner } from "@/components/auth/ui/AuthBanner";

export default function SignUp() {
    const { mutateAsync: signupMutation, isPending: isMutating } = useSignup();

    // Initialize TanStack Form
    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            signupMutation(value);
            form.reset();
        },
    });

    const oauthTriggerURL = `${import.meta.env.VITE_API_URL}/auth/google`;

    const handleOAuth = () => {
        window.location.href = oauthTriggerURL;
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4 md:p-0">
            <div className="bg-card text-card-foreground border-border grid min-h-[600px] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border shadow-xl md:grid-cols-2">
                {/* Left Form */}
                <div className="flex w-full flex-col justify-between p-8">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground rounded-lg p-2">
                            <Blocks className="h-5 w-5" />
                        </div>
                        <span className="font-sans text-xl font-bold tracking-tight">
                            Choicely
                        </span>
                    </div>

                    <div className="mx-auto my-auto w-full max-w-sm space-y-5">
                        <div className="space-y-1">
                            <h1 className="font-sans text-3xl font-bold tracking-tight">
                                Create an account
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Join Choicely to design beautiful interactive
                                polls.
                            </p>
                        </div>

                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-3.5"
                        >
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                {/* First Name Field */}
                                <form.Field
                                    name="firstName"
                                    validators={{
                                        onChange: ({ value }) =>
                                            !value
                                                ? "Required"
                                                : value.trim().length < 2
                                                  ? "Too short"
                                                  : undefined,
                                    }}
                                >
                                    {field => (
                                        <div className="space-y-1">
                                            <label
                                                htmlFor={field.name}
                                                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                                            >
                                                First Name
                                            </label>
                                            <div className="relative">
                                                <User className="text-muted-foreground absolute top-3.5 left-3 h-4 w-4" />
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={e =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="John"
                                                    className="bg-secondary text-secondary-foreground border-border focus:ring-ring/40 w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
                                                />
                                            </div>
                                            {field.state.meta.isTouched &&
                                            field.state.meta.errors.length ? (
                                                <p className="text-destructive animate-in fade-in mt-0.5 text-xs font-medium duration-200">
                                                    {field.state.meta.errors.join(
                                                        ", "
                                                    )}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </form.Field>

                                {/* Last Name Field */}
                                <form.Field
                                    name="lastName"
                                    validators={{
                                        onChange: ({ value }) => {
                                            if (!value || value.trim() === "") {
                                                return undefined;
                                            }

                                            return value.trim().length < 2
                                                ? "Too short"
                                                : undefined;
                                        },
                                    }}
                                >
                                    {field => (
                                        <div className="space-y-1">
                                            <label
                                                htmlFor={field.name}
                                                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                                            >
                                                Last Name
                                            </label>
                                            <div className="relative">
                                                <User className="text-muted-foreground absolute top-3.5 left-3 h-4 w-4" />
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={e =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    type="text"
                                                    placeholder="Doe"
                                                    className="bg-secondary text-secondary-foreground border-border focus:ring-ring/40 w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
                                                />
                                            </div>
                                            {field.state.meta.isTouched &&
                                            field.state.meta.errors.length ? (
                                                <p className="text-destructive animate-in fade-in mt-0.5 text-xs font-medium duration-200">
                                                    {field.state.meta.errors.join(
                                                        ", "
                                                    )}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                            {/* Email Address Field */}
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: ({ value }) =>
                                        !value
                                            ? "Email is required"
                                            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                                    value
                                                )
                                              ? "Invalid email address"
                                              : undefined,
                                }}
                            >
                                {field => (
                                    <div className="space-y-1">
                                        <label
                                            htmlFor={field.name}
                                            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="text-muted-foreground absolute top-3.5 left-3 h-4 w-4" />
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                type="email"
                                                placeholder="you@example.com"
                                                className="bg-secondary text-secondary-foreground border-border focus:ring-ring/40 w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
                                            />
                                        </div>
                                        {field.state.meta.isTouched &&
                                        field.state.meta.errors.length ? (
                                            <p className="text-destructive animate-in fade-in mt-0.5 text-xs font-medium duration-200">
                                                {field.state.meta.errors.join(
                                                    ", "
                                                )}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </form.Field>

                            {/* Password Field */}
                            <form.Field
                                name="password"
                                validators={{
                                    onChange: ({ value }) =>
                                        !value
                                            ? "Password is required"
                                            : value.length < 8
                                              ? "Password must be at least 8 characters"
                                              : undefined,
                                }}
                            >
                                {field => (
                                    <div className="space-y-1">
                                        <label
                                            htmlFor={field.name}
                                            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="text-muted-foreground absolute top-3.5 left-3 h-4 w-4" />
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-secondary text-secondary-foreground border-border focus:ring-ring/40 w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
                                            />
                                        </div>
                                        {field.state.meta.isTouched &&
                                        field.state.meta.errors.length ? (
                                            <p className="text-destructive animate-in fade-in mt-0.5 text-xs font-medium duration-200">
                                                {field.state.meta.errors.join(
                                                    ", "
                                                )}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            </form.Field>

                            {/* Submit Button */}
                            <form.Subscribe
                                selector={state => [state.canSubmit]}
                            >
                                {([canSubmit]) => (
                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isMutating}
                                        className="bg-primary text-primary-foreground group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        {isMutating
                                            ? "Creating Account..."
                                            : "Get Started"}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                )}
                            </form.Subscribe>
                        </form>

                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <span className="border-border w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card text-muted-foreground px-2">
                                    Or register with
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleOAuth}
                            className="bg-secondary text-secondary-foreground border-border hover:text-accent-foreground focus-visible:ring-ring/50 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-xs transition-all duration-200 hover:bg-white/80 hover:shadow-md focus-visible:ring-2 focus-visible:outline-hidden dark:hover:bg-white/10"
                        >
                            <img
                                src={GoogleIcon}
                                alt="Google"
                                className="h-4 w-4 object-contain"
                            />
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    <div className="text-muted-foreground mt-6 text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-foreground font-semibold hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right banner */}
                <AuthBanner />
            </div>
        </div>
    );
}
