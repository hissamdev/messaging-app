"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import z from "zod";
import { FormState } from "./friendRequests";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

const userSchema = z.object({
    email: z.email(),
    password: z.string(),
    username: z.string(),
});
export async function createUser(prevState: FormState, formData: FormData) {
    const rawForm = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
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

const signInSchema = z.object({
    email: z.email().optional(),
    password: z.string(),
    username: z.string(),
});
export async function signIn(prevState: FormState, formData: FormData) {
    const rawForm = {
        username: formData.get("username"),
        password: formData.get("password"),
    };

    const safeForm = signInSchema.safeParse(rawForm);
    if (!safeForm.success) {
        return {
            success: false,
            message: safeForm.error.issues[0].message,
        };
    }

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (session) {
            return {
                success: false,
                message: "Already signed in",
            };
        }

        const res = await auth.api.signInUsername({
            body: {
                username: safeForm.data.username,
                password: safeForm.data.password,
            },
        });

        if (!res) {
            return {
                success: false,
                message: "Sign in actually failed",
            };
        }

        return {
            success: false,
            message: "Signed in successfully",
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Failed to sign in",
        };
    }
}
