/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { DurableObject } from 'cloudflare:workers';

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response("Hello World!");
// 	},
// } satisfies ExportedHandler<Env>;

// async function handleErrors(request, func) {
// 	try {
// 		return await func();
// 	} catch (err) {
// 		if (request.headers.get('Upgrade') == 'websocket') {
// 		}
// 	}
// }

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/ws')) {
			const upgradeHeader = request.headers.get('Upgrade');
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				return new Response('Worker expected Upgrade: websocket', {
					status: 426,
				});
			}

			if (request.method !== 'GET') {
				return new Response('Worker expected GET method', {
					status: 400,
				});
			}

			const roomId = url.searchParams.get('channel');
			if (!roomId) {
				return new Response('Missing channel id', {
					status: 400,
				});
			}
			let stub = env.WEBSOCKET_HIBERNATION_SERVER.getByName(roomId);
			return stub.fetch(request);
		}

		return new Response(
			`Supported endpoints:
			/websocket: Expects a WebSocket upgrade request`,
			{
				status: 400,
				headers: {
					'Content-Type': 'text/plain',
				},
			},
		);
	},
};

export class WebSocketHibernationServer extends DurableObject {
	sessions: Map<WebSocket, { [key: string]: string }>;
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.sessions = new Map();
		this.ctx.getWebSockets().forEach((ws) => {
			let attachment = ws.deserializeAttachment();
			if (attachment) {
				this.sessions.set(ws, { ...attachment });
			}
		});
		this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
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

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		ws.close(code, reason);
		this.sessions.delete(ws);
	}
}
