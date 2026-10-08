"use client";

import { sendRequest } from "@/src/actions/friendRequests";
import { createUser } from "@/src/actions/userActions";
import React, { useActionState, useState } from "react";

export default function RequestBox() {
    const [state, formAction] = useActionState(createUser, {
        success: true,
        message: "",
    });

    return (
        <form
            action={formAction}
            className="w-150 h-full border border-gray-700 rounded-3xl flex flex-col items-center"
        >
            Create User
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
