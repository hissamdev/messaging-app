"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../db/schema";
import z from "zod";
import { FormState } from "./friendRequests";

const db = drizzle(process.env.DATABASE_URL!);

export async function createUser(prevState: FormState, formdata: FormData) {
    const rawUsername = formdata.get("username");
    const safeUsername = z
        .string()
        .min(3, "Minimum 3 characters")
        .safeParse(rawUsername);
    if (!safeUsername.success) {
        return {
            success: false,
            message: safeUsername.error.issues[0].message,
        };
    }

    try {
        const res = await db.insert(users).values({
            username: safeUsername.data,
        });

        return {
            success: true,
            message: "User Created " + safeUsername.data,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "An error occured",
        };
    }
}
