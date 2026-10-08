import { DurableObject } from "cloudflare:workers";
import { Context } from "hono";

export async function websocketController(
    c: Context<{ Bindings: CloudflareBindings }>,
) {
    const request = c.req.raw;

    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
        return c.text("Worker expected an upgrade request", 426);
    }

    const channelId = c.req.query("channel");
    if (!channelId) {
        return c.text("Missing channel id", 400);
    }

    let stub = c.env.WEBSOCKET_HIBERNATION_SERVER.getByName(channelId);
    return stub.fetch(c.req.raw);
}

export class WebSocketHibernationServer extends DurableObject {
    sessions: Map<WebSocket, { [key: string]: string }>;
    constructor(ctx: DurableObjectState, env: CloudflareBindings) {
        super(ctx, env);
        this.sessions = new Map();
        this.ctx.getWebSockets().forEach((ws) => {
            let attachment = ws.deserializeAttachment();
            if (attachment) {
                this.sessions.set(ws, { ...attachment });
            }
        });
        this.ctx.setWebSocketAutoResponse(
            new WebSocketRequestResponsePair("ping", "pong"),
        );
    }
    async fetch(request: Request): Promise<Response> {
        const webSocketPair = new WebSocketPair();
        const [client, server] = Object.values(webSocketPair);
        this.ctx.acceptWebSocket(server);

        const id = crypto.randomUUID();
        server.serializeAttachment({ id });
        this.sessions.set(server, { id });

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
        const session = this.sessions.get(ws)!;
        // ws.send(
        // 	`[Durable Object] message: ${message}, from ${session.id}, to: the initiating client. Total connections: ${this.sessions.size}`,
        // );

        // this.sessions.forEach((attachment, connectedWs) => {
        // 	connectedWs.send(
        // 		`[Durable Object] message: ${message}, from: ${session.id}, to: all clients. Total connections: ${this.sessions.size}`,
        // 	);
        // });

        this.sessions.forEach((attachment, connectedWs) => {
            if (connectedWs !== ws) {
                connectedWs.send(message);
            }
        });
    }

    async webSocketClose(
        ws: WebSocket,
        code: number,
        reason: string,
        wasClean: boolean,
    ) {
        ws.close(code, reason);
        this.sessions.delete(ws);
    }
}
