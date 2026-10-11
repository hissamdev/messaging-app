"use client";

import { getMessages, storeMessage } from "@/src/actions/messageActions";
import { user } from "@/src/db/schema";
import { authClient } from "@/src/lib/auth-client";
import { WsResponse } from "@/src/types/generalTypes";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

type Chat = {
    id: string;
    channelId: string;
    content: string;
    user: typeof user.$inferSelect;
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
    const [sending, setSending] = useState(false); // UI state
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: session, error } = await authClient.getSession();
            if (!session) {
                console.log(error?.message);
                router.push("/dms");
            }
        };

        const loadMessages = async () => {
            const fetchedMessages = await getMessages(dm);
            if (!fetchedMessages) return;
            setChat(fetchedMessages);
        };
        let timer: ReturnType<typeof setTimeout>;

        const connect = () => {
            console.log("Creating ws");
            wsRef.current = new WebSocket(
                `${process.env.NEXT_PUBLIC_CHAT_SERVER!}/ws?channel=${dm}`,
            );

            wsRef.current.onmessage = (wsResponse: MessageEvent) => {
                const parsedWs: WsResponse = JSON.parse(wsResponse.data);
                // setChat((prev) => [...prev, parsedWs]);
            };

            // wsRef.current.onclose = () => {
            //     timer = setTimeout(connect, 2000);
            // };
        };
        checkAuth();
        loadMessages();
        connect();
        return () => {
            console.log("Checking");

            wsRef.current?.close();
            wsRef.current = null;
        };
    }, []);

    const userId = "bfb633b2-9352-4bd9-b8af-6df58bbfaa74";
    const handleSend = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const payload = {
                channelId: dm,
                content: message,
            };
            const stringified = JSON.stringify(payload);
            // setChat((prev) => [...prev, payload]);
            setSending(true);
            wsRef.current.send(stringified);
            await storeMessage(userId, message, dm);
            setSending(false);
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
                                <p
                                    key={idx}
                                    style={{
                                        color: sending ? "#FFFFFFCC" : "white",
                                    }}
                                >
                                    {c.content} {c.user?.username}
                                </p>
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
