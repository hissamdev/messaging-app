"use client";

import { use, useEffect, useRef, useState } from "react";

type Chat = {
    userId: string;
    channelId: string;
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
            console.log("Creating ws");
            wsRef.current = new WebSocket(
                `${process.env.NEXT_PUBLIC_CHAT_SERVER!}/ws?channel=${dm}`,
            );

            wsRef.current.onmessage = (wsResponse: MessageEvent) => {
                const parsedWs: Chat = JSON.parse(wsResponse.data);
                setChat((prev) => [...prev, parsedWs]);
            };

            // wsRef.current.onclose = () => {
            //     timer = setTimeout(connect, 2000);
            // };
        };
        connect();
        return () => {
            console.log("Checking");

            wsRef.current?.close();
            wsRef.current = null;
        };
    }, []);

    const userId = "bfb633b2-9352-4bd9-b8af-6df58bbfaa74";
    const handleSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const payload = {
                userId,
                channelId: dm,
                message,
            };
            const stringified = JSON.stringify(payload);
            wsRef.current.send(stringified);
            setChat((prev) => [...prev, payload]);
            setMessage("");
        }
    };

    return (
        <>
            <section className="p-16 h-screen">
                <div className="p-12 w-full h-full border rounded-3xl flex flex-col gap-8">
                    <div className="h-full flex">
                        <div className="mt-auto">
                            {chat.map((c, idx) => (
                                <p key={idx}>{c.message}</p>
                            ))}
                        </div>
                    </div>
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
                        className="px-2 py-1 self-end border rounded-md w-full"
                        placeholder="Enter message"
                    />
                </div>
            </section>
        </>
    );
}
