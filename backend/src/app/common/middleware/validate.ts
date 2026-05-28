import type { Request, Response, NextFunction } from "express";
import type z from "zod";
import apiError from "../utils/apiError.js";

export const validate =
    (schema: z.ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.safeParseAsync(req.body);

            if (!result.success) {
                return next(
                    apiError.badRequest(
                        "Validation error",
                        result.error.issues,
                    ),
                );
            }
            req.body = result.data;

            return next();
        } catch (error) {
            return next(error);
        }
    };
