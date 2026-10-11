"use client";

import { useEffect, useState } from "react";
import RequestBox from "./RequestBox";
import { DMPartUser, getDms } from "@/src/actions/uiActions";
import Link from "next/link";

export default function Home() {
    const [dms, setDms] = useState<any[]>([]);
    const userId = "PWBXNDvTDPWe0mfG5ZfXH5FL6ZGKjV0I";
    useEffect(() => {
        const load = async () => {
            const dms = await getDms();
            setDms(dms.data);
        };

        load();
    }, []);
    return (
        <>
            <section className="h-screen py-20 mx-auto">
                <RequestBox />
                <div className="mt-4 w-150 h-1/2 border border-gray-700 rounded-3xl flex flex-col items-center">
                    {dms.map((dm: DMPartUser) => (
                        <div key={dm.id} className="text-white">
                            <Link
                                href={`/dms/${dm.id}`}
                                className="block px-3 py-1.5 border rounded-2xl"
                            >
                                {dm.participants.map(
                                    (participant) =>
                                        participant.user.id !== userId &&
                                        participant.user.username,
                                )}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
