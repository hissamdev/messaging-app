import * as p from "drizzle-orm/pg-core";

export const user = p.pgTable("users", {
    id: p.text("id").primaryKey(),
    username: p.varchar("username", { length: 255 }).unique(),
    displayUsername: p.text("display_username"),
    name: p.text("name").notNull(),
    email: p.text("email").notNull().unique(),
    emailVerified: p.boolean("email_verified").default(false).notNull(),
    image: p.text("image"),
    createdAt: p.timestamp("created_at").defaultNow().notNull(),
    updatedAt: p
        .timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const friendRequests = p.pgTable("friend_requests", {
    id: p.serial("id").primaryKey(),
    createdAt: p.timestamp("created_at").defaultNow().notNull(),
    senderId: p
        .text("sender_id")
        .notNull()
        .references(() => user.id),
    receiverId: p
        .text("receiver_id")
        .notNull()
        .references(() => user.id),
});

export const friendships = p.pgTable("friendships", {
    id: p.serial("id").primaryKey(),
    initiatorId: p
        .text("initiator_id")
        .notNull()
        .references(() => user.id),
    recipientId: p
        .text("recipient_id")
        .notNull()
        .references(() => user.id),
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
        .text("user_id")
        .notNull()
        .references(() => user.id),
});

export const messages = p.pgTable("messages", {
    id: p.uuid("id").primaryKey().defaultRandom(),
    channelId: p.uuid().notNull(),
    userId: p
        .text()
        .notNull()
        .references(() => user.id),
    content: p.text().notNull().default(""),
});

// Better Auth Tables

export const session = p.pgTable(
    "session",
    {
        id: p.text("id").primaryKey(),
        expiresAt: p.timestamp("expires_at").notNull(),
        token: p.text("token").notNull().unique(),
        createdAt: p.timestamp("created_at").defaultNow().notNull(),
        updatedAt: p
            .timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: p.text("ip_address"),
        userAgent: p.text("user_agent"),
        userId: p
            .text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [p.index("session_userId_idx").on(table.userId)],
);

export const account = p.pgTable(
    "account",
    {
        id: p.text("id").primaryKey(),
        accountId: p.text("account_id").notNull(),
        providerId: p.text("provider_id").notNull(),
        userId: p
            .text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: p.text("access_token"),
        refreshToken: p.text("refresh_token"),
        idToken: p.text("id_token"),
        accessTokenExpiresAt: p.timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: p.timestamp("refresh_token_expires_at"),
        scope: p.text("scope"),
        password: p.text("password"),
        createdAt: p.timestamp("created_at").defaultNow().notNull(),
        updatedAt: p
            .timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [p.index("account_userId_idx").on(table.userId)],
);

export const verification = p.pgTable(
    "verification",
    {
        id: p.text("id").primaryKey(),
        identifier: p.text("identifier").notNull(),
        value: p.text("value").notNull(),
        expiresAt: p.timestamp("expires_at").notNull(),
        createdAt: p.timestamp("created_at").defaultNow().notNull(),
        updatedAt: p
            .timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [p.index("verification_identifier_idx").on(table.identifier)],
);
