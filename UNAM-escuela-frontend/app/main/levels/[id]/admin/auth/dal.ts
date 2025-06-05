'use server';

import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export const verifySession = async ()=>{
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;
    if(!token){
        redirect("/main/levels");
    }
    return token;
}