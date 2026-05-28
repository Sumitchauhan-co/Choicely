import { useForm } from "@tanstack/react-form";
import { Mail, Send, MessageSquare } from "lucide-react";

import { useContact } from "@/hooks/useAuth";

export default function Contact() {
    const { mutateAsync: contactMutation } = useContact();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
        onSubmit: async ({ value }) => {
            contactMutation(value);
            form.reset();
        },
    });

    return (
        <section className="bg-background text-foreground flex min-h-screen w-full items-center px-4 py-16 md:px-8">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Left Column: Contact Info Info Panel */}
                <div className="flex flex-col justify-center space-y-8 lg:col-span-5">
                    <div className="space-y-4">
                        <div className="bg-primary/10 text-primary border-primary/10 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Get In Touch
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            Let's talk about Choicely.
                        </h1>
                        <p className="text-muted-foreground max-w-md leading-relaxed">
                            Have a question about live polling operations,
                            system configurations, or integration capabilities?
                            Drop us a line.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-muted border-border/40 text-primary rounded-xl border p-3">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                                    Email
                                </h4>
                                <p className="mt-0.5 text-base font-medium">
                                    sumit.chauhan.code@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-muted-foreground/60 border-border/60 border-t pt-6 text-xs">
                        Our team typically responds to all inquiries within 24
                        operational hours.
                    </div>
                </div>

                {/* Right Column: Contact Interactive Form Block */}
                <div className="lg:col-span-7">
                    <div className="bg-card border-border/80 relative overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-md md:p-10">
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="relative z-10 space-y-5"
                        >
                            {/* Row 1: Name & Email Side by Side */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <form.Field
                                    name="name"
                                    validators={{
                                        onChange: ({ value }) => {
                                            if (!value || value.length < 2)
                                                return "Name must be at least 2 characters";
                                            if (value.length > 255)
                                                return "Name cannot exceed 255 characters";
                                            return undefined;
                                        },
                                    }}
                                    children={field => (
                                        <div className="space-y-2">
                                            <label
                                                htmlFor={field.name}
                                                className="text-foreground text-sm font-semibold tracking-tight"
                                            >
                                                Your Name
                                            </label>
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
                                                className="border-border/80 focus:border-primary focus:ring-primary bg-background w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-hidden"
                                                placeholder="John Doe"
                                            />
                                            {field.state.meta.errors ? (
                                                <p className="text-destructive text-xs">
                                                    {field.state.meta.errors.join(
                                                        ", "
                                                    )}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                />

                                <form.Field
                                    name="email"
                                    validators={{
                                        onChange: ({ value }) => {
                                            const trimmed = value.trim();
                                            if (!trimmed || trimmed.length < 6)
                                                return "Email must be at least 6 characters";
                                            if (trimmed.length > 255)
                                                return "Email cannot exceed 255 characters";
                                            if (
                                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                                    trimmed
                                                )
                                            )
                                                return "Invalid email address";
                                            return undefined;
                                        },
                                    }}
                                    children={field => (
                                        <div className="space-y-2">
                                            <label
                                                htmlFor={field.name}
                                                className="text-foreground text-sm font-semibold tracking-tight"
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="border-border/80 focus:border-primary focus:ring-primary bg-background w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-hidden"
                                                placeholder="john@example.com"
                                            />
                                            {field.state.meta.errors ? (
                                                <p className="text-destructive text-xs">
                                                    {field.state.meta.errors.join(
                                                        ", "
                                                    )}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Row 2: Phone (Full Width) */}
                            <form.Field
                                name="phone"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (value && value.trim().length > 50)
                                            return "Phone number cannot exceed 50 characters";
                                        return undefined;
                                    },
                                }}
                                children={field => (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor={field.name}
                                            className="text-foreground flex items-center gap-1.5 text-sm font-semibold tracking-tight"
                                        >
                                            Phone Number{" "}
                                            <span className="text-muted-foreground text-xs font-normal">
                                                (Optional)
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={e =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="border-border/80 focus:border-primary focus:ring-primary bg-background w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-hidden"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        {field.state.meta.errors ? (
                                            <p className="text-destructive text-xs">
                                                {field.state.meta.errors.join(
                                                    ", "
                                                )}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            />

                            {/* Row 3: Subject (Stacked Directly Below Phone) */}
                            <form.Field
                                name="subject"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (value && value.trim().length > 50)
                                            return "Message cannot exceed 50 characters";
                                        return undefined;
                                    },
                                }}
                                children={field => (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor={field.name}
                                            className="text-foreground text-sm font-semibold tracking-tight"
                                        >
                                            Subject
                                        </label>
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
                                            className="border-border/80 focus:border-primary focus:ring-primary bg-background w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-hidden"
                                            placeholder="How can we help you?"
                                        />
                                        {field.state.meta.errors ? (
                                            <p className="text-destructive text-xs">
                                                {field.state.meta.errors.join(
                                                    ", "
                                                )}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            />

                            {/* Row 4: Message Textarea */}
                            <form.Field
                                name="message"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value || value.trim().length < 10)
                                            return "Message must be at least 10 characters long";
                                        return undefined;
                                    },
                                }}
                                children={field => (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor={field.name}
                                            className="text-foreground text-sm font-semibold tracking-tight"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            rows={5}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={e =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="border-border/80 focus:border-primary focus:ring-primary bg-background w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-hidden"
                                            placeholder="Type your message details here..."
                                        />
                                        {field.state.meta.errors ? (
                                            <p className="text-destructive text-xs">
                                                {field.state.meta.errors.join(
                                                    ", "
                                                )}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            />

                            {/* Form Submission Button */}
                            <form.Subscribe
                                selector={state => [
                                    state.canSubmit,
                                    state.isSubmitting,
                                ]}
                                children={([canSubmit, isSubmitting]) => (
                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isSubmitting}
                                        className="bg-primary text-primary-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-xs transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                    >
                                        {isSubmitting
                                            ? "Sending..."
                                            : "Send Message"}
                                        <Send className="h-4 w-4" />
                                    </button>
                                )}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
