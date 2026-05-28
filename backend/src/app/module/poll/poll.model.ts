import z from "zod";

export const createPollModel = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name must be at least 1 character long")
        .max(20, "Name should be precise and must be within 20 characters"),
    question: z
        .string()
        .trim()
        .min(3, "Question must be at least 3 characters long")
        .max(500, "Question is too long"),

    options: z
        .array(z.string().trim().min(1, "Option cannot be empty"))
        .min(2, "You must provide at least 2 options")
        .max(10, "You can provide a maximum of 10 options"),

    isActive: z.boolean().default(true),

    isPublic: z.boolean().default(true),

    allowMultipleVotes: z.boolean().default(false),

    expiresAt: z
        .string()
        .datetime({ offset: true })
        .pipe(z.coerce.date())
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                const oneMinuteAgo = new Date(Date.now() - 60000);
                return date > oneMinuteAgo;
            },
            {
                message: "Expiration date must be in the future",
            },
        ),
});

export const updatePollModel = z.object({
    name: z
        .string()
        .min(1, "Name must be at least 1 character long")
        .max(20, "Name should be precise and must be within 20 characters")
        .optional(),
    question: z
        .string()
        .trim()
        .min(3, "Question must be at least 3 characters long")
        .max(500, "Question is too long")
        .optional(),

    options: z
        .array(z.string().trim().min(1, "Option cannot be empty"))
        .min(2, "You must provide at least 2 options")
        .max(10, "You can provide a maximum of 10 options")
        .optional(),

    isActive: z.boolean().optional(),

    isPublic: z.boolean().optional(),

    allowMultipleVotes: z.boolean().optional(),

    expiresAt: z
        .string()
        .datetime({ offset: true })
        .pipe(z.coerce.date())
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                const oneMinuteAgo = new Date(Date.now() - 60000);
                return date > oneMinuteAgo;
            },
            {
                message: "Expiration date must be in the future",
            },
        )
        .optional(),
});

export type CreatePollInput = z.infer<typeof createPollModel>;
export type UpdatePollInput = z.infer<typeof updatePollModel>;
