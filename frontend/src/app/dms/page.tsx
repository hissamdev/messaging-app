"use client";

import { useEffect, useState } from "react";
import RequestBox from "./RequestBox";
import { DMPartUser, getDms } from "@/src/actions/uiActions";

export default function Home() {
    const [dms, setDms] = useState<any[]>([]);
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
                            {dm.id}
                            <div>yo mama</div>

                            <div>{dm.participants.length.toString()} hi</div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
