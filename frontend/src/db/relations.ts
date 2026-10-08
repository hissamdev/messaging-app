import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    users: {
        sentRequests: r.many.friendRequests(),
        receivedRequests: r.many.friendRequests(),
    },
    friendRequests: {
        sender: r.one.users({
            from: r.friendRequests.senderId,
            to: r.users.id,
        }),
        receiver: r.one.users({
            from: r.friendRequests.receiverId,
            to: r.users.id,
        }),
    },
    directMessages: {
        participants: r.many.dmParticipants(),
    },
    dmParticipants: {
        dm: r.one.directMessages({
            from: r.dmParticipants.dmId,
            to: r.directMessages.id,
        }),
    },
}));
