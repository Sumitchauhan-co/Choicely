// src/app/module/auth/types/type.ts

// 1. Declare a clean, reusable interface for your application's User model object
export interface AppUser {
    id: string;
    role: string;
    authId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

declare global {
    namespace Express {
        // 2. This updates Passport's internal typing across your entire app
        interface User extends AppUser {}

        // 3. This ensures the Request object knows about it optionally too
        interface Request {
            user?: User;
        }
    }
}
