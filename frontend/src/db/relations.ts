import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    users: {
        sentRequests: r.many.friendRequests({ alias: "sender" }),
        receivedRequests: r.many.friendRequests({ alias: "receiver" }),
        initiatedFriendships: r.many.friendships({ alias: "initiated" }),
        receivedFriendships: r.many.friendships({ alias: "received" }),
        participant: r.many.dmParticipants(),
    },
    friendRequests: {
        sender: r.one.users({
            from: r.friendRequests.senderId,
            to: r.users.id,
            alias: "sender",
        }),
        receiver: r.one.users({
            from: r.friendRequests.receiverId,
            to: r.users.id,
            alias: "receiver",
        }),
    },
    friendships: {
        initiator: r.one.users({
            from: r.friendships.initiatorId,
            to: r.users.id,
            alias: "initiated",
        }),
        recipient: r.one.users({
            from: r.friendships.recipientId,
            to: r.users.id,
            alias: "received",
        }),
    },
    directMessages: {
        participants: r.many.dmParticipants(),
    },
    dmParticipants: {
        participants: r.one.directMessages({
            from: r.dmParticipants.dmId,
            to: r.directMessages.id,
        }),
        user: r.one.users({
            from: r.dmParticipants.userId,
            to: r.users.id,
        }),
    },
}));
