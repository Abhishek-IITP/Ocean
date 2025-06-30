import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hook"
import { nylas, nylasConfig } from "@/app/lib/nylas";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server"

export async function GET(req: NextRequest){
    const session = await requireUser();


    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return  Response.json("Code not provided", { status: 400 });
    }

    try {
        const response = await nylas.auth.exchangeCodeForToken({
            code: code,
            clientSecret: nylasConfig.apiKey,
            clientId: nylasConfig.clientId,
            redirectUri: nylasConfig.redirectUri,
        });
        const{grantId, email}= response;
        await prisma.user.update({
            where:{
                id: session.user?.id,
            },
            data:{
                grantId,
                grandEmail: email
            }
        })
        // return Response.json(response);
    } catch (error) {
        return Response.json(`Error exchanging code for token: ${error}`, { status: 500 });
    }

    redirect("/dashboard");
}