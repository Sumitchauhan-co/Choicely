import z from "zod";

export const signupModel = z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().max(255).nullish(),
    email: z.email().min(6).max(255).lowercase().trim(),
    password: z.string().min(8).max(255),
});

export const signinModel = z.object({
    email: z.email().min(6).max(255).lowercase().trim(),
    password: z.string().min(8).max(255),
});

export const contactModel = z.object({
    name: z.string().min(2).max(255),
    email: z.email().min(6).max(255).lowercase().trim(),
    subject: z
        .string()
        .max(50, { message: "Message cannot exceed 50 characters" })
        .trim(),
    phone: z.string().trim().max(50).optional(),
    message: z
        .string()
        .min(10, { message: "Message must be at least 10 characters long" })
        .trim(),
});
