import { redirect } from "next/navigation";
import { auth } from "./auth";

export  async function requireUser(){
    const session = await auth();
    if(!session?.user) {
        return redirect("/");
        // throw new Error("Unauthorized");
    }
    return session;
}