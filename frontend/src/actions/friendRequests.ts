"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { friendRequests, users } from "../db/schema";

export type FormState = {
    success: boolean;
    message: string;
};

const db = drizzle(process.env.DATABASE_URL!);

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

    try {
        // const alreadyFriends = await db.select().from();

        await db.select().from(users);
    } catch (err) {}

    return {
        success: true,
        message: "Request sent successfully",
    };
}
