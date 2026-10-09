"use client";

import { use, useEffect, useRef, useState } from "react";

type Chat = {
    message: string;
};

export default function DirectMessage({
    params,
}: {
    params: Promise<{ dm: string }>;
}) {
    const { dm } = use(params);
    const wsRef = useRef<WebSocket | null>(null);

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<Chat[]>([]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const connect = () => {
            wsRef.current = new WebSocket(process.env.NEXT_PUBLIC_CHAT_SERVER!);

            // wsRef.current.onmessage = (ws) => {
            //     setChat(ws);
            // };

            wsRef.current.onclose = () => {
                timer = setTimeout(connect, 2000);
            };
        };
        connect();
        return () => {
            wsRef.current?.close();
            wsRef.current = null;
            clearTimeout(timer);
        };
    }, []);

    const handleSend = () => {
        // if (wsRef.current?.readyState === WebSocket.OPEN) {
        //     wsRef.current.send(message);
        //     setMessage("");
        // }
        setMessage("");
    };

    return (
        <>
            <section className="p-16 h-screen">
                <div className="w-full h-full border rounded-3xl flex">
                    <div>
                        {chat.map((c) => (
                            <p>c</p>
                        ))}
                    </div>
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="m-12 px-2 py-1 self-end border rounded-md w-full"
                        placeholder="Enter message"
                    />
                </div>
            </section>
        </>
    );
}
