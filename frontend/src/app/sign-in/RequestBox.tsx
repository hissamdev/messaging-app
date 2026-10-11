"use client";

import { createUser, signIn } from "@/src/actions/userActions";
import React, { useActionState, useState } from "react";

export default function RequestBox() {
    const [state, formAction] = useActionState(signIn, {
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
                className="mt-4 border border-gray-700 rounded-md p-2"
            />
            <input
                // value={username}
                // onChange={(e) => setUsername(e.target.value)}
                name="email"
                placeholder="Enter email"
                className="mt-4 border border-gray-700 rounded-md p-2"
            />
            <input
                // value={username}
                // onChange={(e) => setUsername(e.target.value)}
                name="password"
                placeholder="Enter password"
                className="mt-4 border border-gray-700 rounded-md p-2"
            />
            <button type="submit">Submit</button>
            {!state.success && <div>{state.message}</div>}
            {state.success && <div>{state.message}</div>}
        </form>
    );
}
