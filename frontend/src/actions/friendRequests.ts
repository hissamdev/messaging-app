"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";
import {
    directMessages,
    dmParticipants,
    friendRequests,
    friendships,
    users,
} from "../db/schema";
import { and, eq, or } from "drizzle-orm";

export type FormState = {
    success: boolean;
    message: string;
};

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!);

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

    const ourId = "bfb633b2-9352-4bd9-b8af-6df58bbfaa74";

    try {
        const userExists = await db
            .select()
            .from(users)
            .where(eq(users.username, safeUsername.data));
        if (!userExists[0]) {
            return {
                success: false,
                message: "User not found or invalid username",
            };
        }
        const alreadySent = await db
            .select()
            .from(friendRequests)
            .where(
                and(
                    eq(friendRequests.senderId, ourId),
                    eq(friendRequests.receiverId, userExists[0].id),
                ),
            );
        if (alreadySent.length > 0 || alreadySent[0]) {
            return {
                success: false,
                message: "A request to this user is still pending",
            };
        }
        const alreadyFriends = await db
            .select()
            .from(friendships)
            .where(
                or(
                    and(
                        eq(friendships.initiatorId, ourId),
                        eq(friendships.recipientId, userExists[0].id),
                    ),
                    and(
                        eq(friendships.initiatorId, ourId),
                        eq(friendships.recipientId, userExists[0].id),
                    ),
                ),
            );
        if (alreadyFriends.length > 0 || alreadyFriends[0]) {
            return {
                success: false,
                message: "You are already friends with this user",
            };
        }

        // Initiate friendship
        await db.transaction(async (tx) => {
            await tx
                .insert(friendships)
                .values({
                    initiatorId: ourId,
                    recipientId: userExists[0].id,
                })
                .returning();
            const [dmId] = await tx
                .insert(directMessages)
                .values({})
                .returning();
            await tx
                .insert(dmParticipants)
                .values([
                    {
                        dmId: dmId.id,
                        userId: ourId,
                    },
                    {
                        dmId: dmId.id,
                        userId: userExists[0].id,
                    },
                ])
                .returning();
        });

        return {
            success: true,
            message: "Friend added",
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
}
