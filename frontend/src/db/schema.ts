import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
    id: p.uuid("id").primaryKey(),
    username: p.text("username").unique().notNull(),
});

export const friendRequests = p.pgTable("friend_requests", {
    id: p.serial("id").primaryKey(),
    createdAt: p.timestamp("created_at").defaultNow().notNull(),
    senderId: p
        .uuid("sender_id")
        .notNull()
        .references(() => users.id),
    receiverId: p
        .uuid("receiver_id")
        .notNull()
        .references(() => users.id),
});
