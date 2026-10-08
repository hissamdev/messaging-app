"use server";

import { z } from "zod";

export type FormState = {
    success: boolean;
    message: string;
};

export async function sendRequest(prevState: FormState, formData: FormData) {
    const rawUsername = formData.get("username") as string;
    const safeUsername = z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .safeParse(rawUsername);
    if (!safeUsername.success) {
        return {
            success: false,
            message: safeUsername.error.issues[0].message,
        };
    }

    return {
        success: true,
        message: "Request sent successfully",
    };
}
