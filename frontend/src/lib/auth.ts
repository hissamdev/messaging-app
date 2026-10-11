import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "../db/relations";
import { username } from "better-auth/plugins";
import * as schema from "../db/schema";
import { nextCookies } from "better-auth/next-js";

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!, {
    relations: relations,
});

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [username(), nextCookies()],
});
