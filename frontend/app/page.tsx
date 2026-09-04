"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState([
        {
            name: "Hissam",
            content: "Hello world",
        },
        {
            name: "Some dude",
            content: "wsp dude",
        },
        {
            name: "Hissam",
            content:
                "yo you won't believe wth happened to me last summer like it was crazy fr",
        },
        {
            name: "Hissam",
            content:
                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefine",
        },
    ]);

    const [message, setMessage] = useState("");
    const [debugName, setDebugName] = useState("");

    const handleEnterMessage = () => {
        const newMessage = {
            name: debugName || "Hissam",
            content: message,
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

    return (
        <div className="p-8 h-screen flex flex-col gap-10 justify-between">
            <div className="flex-1 p-3 flex flex-col gap-1 justify-end border border-gray-600">
                {messages.map((message) => (
                    <div
                        key={message.content}
                        className={`${message.name === "Hissam" ? "self-end" : "self-start"}
                          
                          max-w-100
                        `}
                    >
                        <div className="px-5 leading-tight py-2 rounded-lg bg-white/10">
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-12">
                <input
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleEnterMessage();
                        }
                    }}
                    placeholder="Enter message"
                    className="px-4 py-1.5 w-full border border-gray-500 rounded-md"
                />
                <input
                    onChange={(e) => setDebugName(e.target.value)}
                    value={debugName}
                    placeholder="Debug: Send as"
                    className="mt-4 px-4 py-1.5 border border-gray-500 rounded-md"
                />
            </div>
        </div>
    );
}
