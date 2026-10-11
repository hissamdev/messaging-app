import { auth } from "@/src/lib/auth";
import RequestBox from "./RequestBox";
import { headers } from "next/headers";

export default async function SignIn() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    console.log(session);

    return (
        <>
            <section className="h-screen py-20 mx-auto">
                <RequestBox />
                {session ? "Logged in" : "Not logged in"}
            </section>
        </>
    );
}
