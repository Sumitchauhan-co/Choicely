import React, { useState, useMemo } from "react";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Upgraded to standard framework namespace import
import { cn } from "@/lib/utils";
import { TimelineAnimation } from "@/components/ui/timeline-animation";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: "general" | "technical" | "billing" | "account" | "legal";
    img: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: "g1",
        category: "general",
        question: "What is this platform about?",
        answer: "Choicely is a premium, real-time polling platform designed to capture audience insights through interactive visual interfaces. It seamlessly transforms static data collection into dynamic, conversational layouts for presentations, feedback, and market research.",
        img: "https://images.unsplash.com/photo-1768280511074-3b3effe7a139?q=80&w=764&auto=format&fit=crop",
    },
    {
        id: "g2",
        category: "general",
        question: "How do I get started?",
        answer: "Sign in to your dashboard, create a new question block with your custom choice fields, and launch the poll instantly. You can immediately copy the unique live link or embed snippet to collect and track streaming real-time analytics.",
        img: "https://images.unsplash.com/photo-1759269834957-3457c9ee46c7?q=80&w=627&auto=format&fit=crop",
    },
    {
        id: "t1",
        category: "technical",
        question: "Is it mobile responsive?",
        answer: "Yes. Every part of Choicely is built with a mobile-first approach using Tailwind CSS. This ensures that the creation dashboard, public polling links, and analytics screens load instantly and adjust perfectly to any screen size or smartphone device.",
        img: "https://images.unsplash.com/photo-1754405300142-246a9bf917d9?q=80&w=627&auto=format&fit=crop",
    },
    {
        id: "t2",
        category: "technical",
        question: "What technologies are used?",
        answer: "The frontend leverages React, TypeScript, Vite, Tailwind CSS, and Zustand, with TanStack tools handling routing, forms, and queries. The backend is driven by Express, PostgreSQL, and Socket.io to stream real-time polling analytics flawlessly.",
        img: "https://images.unsplash.com/photo-1738510992679-41f599ec9399?q=80&w=627&auto=format&fit=crop",
    },
    // {
    //     id: "b1",
    //     category: "billing",
    //     question: "What payment methods are accepted?",
    //     answer: "We accept all major credit cards, PayPal, and cryptocurrency assets for our premium enterprise subscription plans.",
    //     img: "https://images.unsplash.com/photo-1688909906484-738d78601884?q=80&w=764&auto=format&fit=crop",
    // },
    // {
    //     id: "b2",
    //     category: "billing",
    //     question: "Can I cancel my subscription anytime?",
    //     answer: "Yes, you can cancel your subscription from your account dashboard at any time. Your features will remain active until the end of the billing cycle.",
    //     img: "https://images.unsplash.com/photo-1703600091728-8d0a2bf13396?q=80&w=711&auto=format&fit=crop",
    // },
    {
        id: "a1",
        category: "account",
        question: "How do I reset my password?",
        answer: 'Go to the login page and click on "Forgot Password". We will send an email with instructions to reset your access securely.',
        img: "https://images.unsplash.com/photo-1642849206045-d34279481967?q=80&w=711&auto=format&fit=crop",
    },
    // {
    //     id: "a2",
    //     category: "account",
    //     question: "Can I share my account?",
    //     answer: "Sharing individual accounts is against our terms of service parameters. We offer dedicated collaborative team plans for multi-user seats.",
    //     img: "https://images.unsplash.com/photo-1667776384514-a06f0b7675a1?q=80&w=764&auto=format&fit=crop",
    // },
    {
        id: "p1",
        category: "legal",
        question: "What is your Privacy Policy regarding user data?",
        answer: "We collect minimal metadata via secure OAuth or email verification solely to manage account access. Choicely enforces strict encryption standards and never sells or trades personal info, polling questions, or voter telemetry.",
        img: "https://images.unsplash.com/photo-1667776384514-a06f0b7675a1?q=80&w=764&auto=format&fit=crop",
    },
    {
        id: "p2",
        category: "legal",
        question: "How are cookies used on the platform?",
        answer: "We utilize secure, encrypted session cookies ('connect.sid') exclusively to maintain your authenticated state across page requests. The platform does not deploy intrusive, third-party cross-site tracking or advertising cookies.",
        img: "https://images.unsplash.com/photo-1703600091728-8d0a2bf13396?q=80&w=711&auto=format&fit=crop",
    },
    {
        id: "p3",
        category: "legal",
        question: "What are the Terms of Service for hosting polls?",
        answer: "Users are required to deploy interactive workspaces responsibly. Generating deceptive, malicious, or phishing poll content is strictly prohibited and will result in immediate account termination and database isolation.",
        img: "https://images.unsplash.com/photo-1688909906484-738d78601884?q=80&w=764&auto=format&fit=crop",
    }
];

type CategoryType = "all" | FAQItem["category"];

export const FaqInteractivePreview = () => {
    const timelineRef = React.useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
    const [activeItem, setActiveItem] = useState<FAQItem | null>(FAQ_DATA[0]);

    // Filter items reactively based on active pill filter category state selection
    const filteredFaqs = useMemo(() => {
        if (activeCategory === "all") return FAQ_DATA;
        return FAQ_DATA.filter((item) => item.category === activeCategory);
    }, [activeCategory]);

    // Auto-select first item of newly selected category tab block to maintain visual consistency
    const handleCategoryChange = (category: CategoryType) => {
        setActiveCategory(category);
        const defaults =
            category === "all"
                ? FAQ_DATA
                : FAQ_DATA.filter((f) => f.category === category);
        if (defaults.length > 0) setActiveItem(defaults[0]);
    };

    return (
        <section
            className="min-h-screen w-full flex flex-col justify-center items-center py-12 md:py-20 px-4 md:px-8 bg-background text-foreground transition-colors duration-300"
            ref={timelineRef}
        >
            <div className="w-full max-w-7xl mx-auto space-y-8">
                {/* Header Block Section */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <TimelineAnimation
                        timelineRef={timelineRef}
                        animationNum={0}
                        as="h2"
                        className="text-3xl md:text-5xl font-bold tracking-tight font-sans text-foreground"
                    >
                        Frequently Asked Questions
                    </TimelineAnimation>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Explore features, configurations, system operations, and
                        structural properties.
                    </p>
                </div>

                {/* Dynamic Category Navigation Filters */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-muted/40 backdrop-blur-xs border border-border/60 max-w-xl mx-auto rounded-xl">
                    {(
                        [
                            "all",
                            "general",
                            "technical",
                            "account",
                            "legal"
                        ] as CategoryType[]
                    ).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={cn(
                                "relative px-8 py-1.5 text-xs font-bold tracking-wide rounded-lg uppercase cursor-pointer select-none transition-colors duration-200 z-10",
                                activeCategory === cat
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <span className="relative z-20 capitalize">
                                {cat}
                            </span>
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-primary rounded-lg shadow-sm z-10"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Core Layout Split Window Framework Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
                    {/* Left Block Side Navigation Panels */}
                    <div className="lg:col-span-7 space-y-3.5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar px-3.5">
                        <AnimatePresence mode="popLayout">
                            {filteredFaqs.map((item) => {
                                const isSelected = activeItem?.id === item.id;
                                return (
                                    <motion.button
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={item.id}
                                        onMouseEnter={() => setActiveItem(item)}
                                        onClick={() => setActiveItem(item)}
                                        className={cn(
                                            "w-full text-left px-5 py-5 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden",
                                            isSelected
                                                ? "bg-card text-card-foreground border-primary shadow-lg shadow-primary/5 scale-[1.01]"
                                                : "bg-card/40 text-muted-foreground border-border/60 hover:bg-muted/40 hover:text-foreground hover:border-border",
                                        )}
                                    >
                                        <div className="flex items-center gap-3.5 pr-4">
                                            <HelpCircle
                                                className={cn(
                                                    "w-4 h-4 shrink-0 transition-colors",
                                                    isSelected
                                                        ? "text-primary"
                                                        : "text-muted-foreground/50 group-hover:text-muted-foreground",
                                                )}
                                            />
                                            <span className="text-sm md:text-base font-semibold tracking-tight">
                                                {item.question}
                                            </span>
                                        </div>

                                        <ArrowRight
                                            className={cn(
                                                "w-4 h-4 shrink-0 transition-all duration-300",
                                                isSelected
                                                    ? "translate-x-0 text-primary opacity-100"
                                                    : "-translate-x-3 opacity-0 text-muted-foreground group-hover:opacity-100 group-hover:translate-x-0",
                                            )}
                                        />
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Right Block Premium Interactive Magic Preview Screen */}
                    <div className="lg:col-span-5 h-full min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeItem?.id}
                                initial={{ opacity: 0, x: 25 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -25 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="bg-muted/40 dark:bg-muted/20 border border-border/80 rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between shadow-2xs backdrop-blur-md relative overflow-hidden group"
                            >
                                {/* Background decorative flare accents */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md bg-primary/10 text-primary px-2.5 py-1 border border-primary/10">
                                            <Sparkles className="w-3 h-3 animate-pulse" />
                                            Interactive Display
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-md border border-border/40">
                                            Index: {activeItem?.id}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight font-sans">
                                        {activeItem?.question}
                                    </h3>

                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {activeItem?.answer}
                                    </p>
                                </div>

                                <div className="mt-6 relative z-10 overflow-hidden rounded-xl border border-border/60 shadow-xs bg-card">
                                    <img
                                        src={activeItem?.img}
                                        alt={activeItem?.question}
                                        className="aspect-video w-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                                        loading="lazy"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};
