"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, exists, inArray, sql } from "drizzle-orm";
import { relations } from "../db/relations";
import { dmParticipants, users } from "../db/schema";
import { directMessages } from "../db/schema";
type DirectMessages = typeof directMessages.$inferSelect;
type Participants = typeof dmParticipants.$inferSelect;
type UserType = typeof users.$inferSelect;

export type DMPartUser = DirectMessages & {
    participants: Participants &
        {
            user: UserType;
        }[];
};

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!, {
    relations: { ...relations },
});

export async function getDms() {
    const ourId = "bfb633b2-9352-4bd9-b8af-6df58bbfaa74";

    const parts = await db.query.directMessages.findMany({
        where: {
            RAW: (dms) => sql`exists(
                ${db.select().from(dmParticipants).where(eq(dmParticipants.userId, ourId))}
            )`,
        },
        with: {
            participants: {
                with: { user: true },
            },
        },
    });

    return {
        success: true,
        message: "Fetched dms successfully",
        data: parts,
    };
}
