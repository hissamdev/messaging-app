import * as p from "drizzle-orm/pg-core";
import { uuid } from "zod";

export const users = p.pgTable("users", {
    id: p.uuid("id").primaryKey().defaultRandom(),
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

export const friendships = p.pgTable("friendships", {
    id: p.serial("id").primaryKey(),
    initiatorId: p
        .uuid("initiator_id")
        .notNull()
        .references(() => users.id),
    recipientId: p
        .uuid("recipient_id")
        .notNull()
        .references(() => users.id),
    createdAt: p.timestamp().defaultNow().notNull(),
});

export const directMessages = p.pgTable("direct_messages", {
    id: p.uuid("id").primaryKey().defaultRandom(),
});

export const dmParticipants = p.pgTable("dm_participants", {
    id: p.serial("id").primaryKey(),
    dmId: p
        .uuid("dm_id")
        .notNull()
        .references(() => directMessages.id),
    userId: p
        .uuid("user_id")
        .notNull()
        .references(() => users.id),
});
