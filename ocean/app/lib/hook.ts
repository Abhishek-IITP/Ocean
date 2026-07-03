import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// `auth()` hits the DB for every call (Auth.js defaults to the "database"
// session strategy when a Prisma adapter is configured). The layout and the
// active page each call requireUser() once per navigation, so without this
// cache() wrapper every navigation pays for that session lookup twice.
export const requireUser = cache(async () => {
    const session = await auth();
    if(!session?.user) {
        return redirect("/");
        // throw new Error("Unauthorized");
    }
    return session;
});