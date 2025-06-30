
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import logo from "@/public/logo.ico"; // Adjust the path as necessary
import { signIn } from "@/app/lib/auth";
import { GithubAuthButton, GoogleAuthButton } from "./SubmitButtons";

export function AuthModel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white">Try For Free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center ">
              <Image src={logo} alt="Logo" className="h-16 w-16  mt-1" />
              <h1 className="text-2xl font-bold">
                O<span className="text-blue-500">cean</span> Authentication
              </h1>
            </div>
          </DialogTitle>
          <p className="text-sm text-gray-500 ml-3 ">
            Authenticate yourself securely with Ocean.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-2 ">
        
          <form action={async()=>{
            "use server";
            await signIn("google");
          }} className="w-full ">
            <GoogleAuthButton />
          </form>

          <form action={async()=>{
            "use server";
            await signIn("github");
          }} className="w-full ">
            <GithubAuthButton />
          </form>
        </div>
      </DialogContent>
      {/* <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">Close</Button>
            </DialogTrigger> */}
    </Dialog>
  );
}
