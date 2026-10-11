import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
});
