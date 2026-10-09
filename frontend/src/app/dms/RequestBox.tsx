"use client";

import { sendRequest } from "@/src/actions/friendRequests";
import React, { useActionState, useState } from "react";

export default function RequestBox() {
    const [state, formAction] = useActionState(sendRequest, {
        success: true,
        message: "",
    });

    return (
        <form
            action={formAction}
            className="w-150 h-1/2 border border-gray-700 rounded-3xl flex flex-col items-center"
        >
            Add your friend
            <input
                // value={username}
                // onChange={(e) => setUsername(e.target.value)}
                name="username"
                placeholder="Enter username"
                className="border border-gray-700 rounded-md p-2"
            />
            {!state.success && <div>{state.message}</div>}
            {state.success && <div>{state.message}</div>}
        </form>
    );
}
