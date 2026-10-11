import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "../db/relations";

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!, {
    relations: relations,
});

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
});
