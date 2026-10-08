import { Hono } from "hono";
import { websocketController } from "./controllers/websocket";
export { WebSocketHibernationServer } from "./controllers/websocket";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/ws", websocketController);

export default app;
