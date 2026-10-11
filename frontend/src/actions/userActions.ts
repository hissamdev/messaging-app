"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import z from "zod";
import { FormState } from "./friendRequests";
import { auth } from "../lib/auth";

const db = drizzle(process.env.DATABASE_URL!);

const userSchema = z.object({
    email: z.email(),
    password: z.string(),
    username: z.string(),
});
export async function createUser(prevState: FormState, formdata: FormData) {
    const rawForm = {
        username: formdata.get("username"),
        email: formdata.get("email"),
        password: formdata.get("password"),
    };

    const safeForm = userSchema.safeParse(rawForm);

    if (!safeForm.success) {
        return {
            success: false,
            message: safeForm.error.issues[0].message,
        };
    }

    try {
        const data = await auth.api.signUpEmail({
            body: {
                email: safeForm.data.email,
                password: safeForm.data.password,
                username: safeForm.data.username,
                displayUsername: safeForm.data.username,
                name: safeForm.data.username,
                callbackURL: "/dms",
            },
        });
        if (!data) {
            return {
                success: false,
                message: "Failed to sign up",
            };
        }

        return {
            success: true,
            message: "User Created " + safeForm.data.username,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Something went wrong, please try again later",
        };
    }
}
