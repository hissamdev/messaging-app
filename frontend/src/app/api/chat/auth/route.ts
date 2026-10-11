import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 },
        );
    }
    const user = {
        id: session.user.id,
        username: session.user.username,
        displayName: session.user.displayUsername,
        email: session.user.email,
        createdAt: session.user.createdAt,
    };

    return NextResponse.json(
        {
            success: true,
            message: "User authenticated",
            data: user,
        },
        { status: 200 },
    );
}
