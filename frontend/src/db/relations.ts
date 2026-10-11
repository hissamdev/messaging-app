import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    user: {
        sentRequests: r.many.friendRequests({ alias: "sender" }),
        receivedRequests: r.many.friendRequests({ alias: "receiver" }),
        initiatedFriendships: r.many.friendships({ alias: "initiated" }),
        receivedFriendships: r.many.friendships({ alias: "received" }),
        participant: r.many.dmParticipants({ alias: "userParticipant" }),
        messages: r.many.messages({ alias: "userAlias" }),

        // Better Auth
        sessions: r.many.session(),
        accounts: r.many.account(),
    },
    friendRequests: {
        sender: r.one.user({
            from: r.friendRequests.senderId,
            to: r.user.id,
            alias: "sender",
        }),
        receiver: r.one.user({
            from: r.friendRequests.receiverId,
            to: r.user.id,
            alias: "receiver",
        }),
    },
    friendships: {
        initiator: r.one.user({
            from: r.friendships.initiatorId,
            to: r.user.id,
            alias: "initiated",
        }),
        recipient: r.one.user({
            from: r.friendships.recipientId,
            to: r.user.id,
            alias: "received",
        }),
    },
    directMessages: {
        participants: r.many.dmParticipants(),
        messages: r.many.messages({ alias: "dmAlias" }),
    },
    dmParticipants: {
        participants: r.one.directMessages({
            from: r.dmParticipants.dmId,
            to: r.directMessages.id,
            alias: "userParticipant",
        }),
        user: r.one.user({
            from: r.dmParticipants.userId,
            to: r.user.id,
        }),
    },
    messages: {
        dm: r.one.directMessages({
            from: r.messages.channelId,
            to: r.directMessages.id,
            alias: "dmAlias",
        }),
        user: r.one.user({
            from: r.messages.userId,
            to: r.user.id,
            alias: "userAlias",
            optional: false,
        }),
    },
    // Better Auth Relations
    session: {
        user: r.one.user({
            from: r.session.userId,
            to: r.user.id,
        }),
    },
    account: {
        user: r.one.user({
            from: r.account.userId,
            to: r.user.id,
        }),
    },
}));
