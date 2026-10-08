import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const server = createServer();

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        console.log("Message received:", message);
        for (const client of wss.clients) {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        }
    });

    socket.on("error", console.error);
});

server.listen(3020, () => {
    console.log("Chat server listening on port 3020");
});
