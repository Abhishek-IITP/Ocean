import Image from "next/image";
import Navbar from "../components/Navbar";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";

export default async function Home() {
  const session = await auth();
  if(session?.user) {
    return redirect("/dashboard");
  }
  return (
    <div className=" min-h-screen max-w-7xl min-w-screen   px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero/>
      {/* <h1 className="text-green-500">Hello good morning..!!</h1> */}
    </div>
  );
}
