"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { messages } from "../db/schema";
import { relations } from "../db/relations";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!, {
    relations: { ...relations },
});

export async function getMessages(dmId: string) {
    try {
        // const res = await db
        //     .select()
        //     .from(messages)
        //     .where(eq(messages.channelId, dmId));
        const res = await db.query.messages.findMany({
            where: { channelId: dmId },
            with: {
                user: true,
            },
        });
        return res;
    } catch (err) {
        console.error(err);
    }
}

export async function storeMessage(
    userId: string,
    message: string,
    dmId: string,
) {
    try {
        await db.insert(messages).values({
            userId,
            channelId: dmId,
            content: message,
        });
        console.log("Message stored to db:", message);
    } catch (err) {
        console.error(err);
    }
}
