// "use server";
import Link from "next/link";
import Logo from "@/public/logo.ico"; // Adjust the path as necessary
import Image from "next/image";
import { ReactNode } from "react";
import { DashboardLinks } from "@/components/DashboardLinks";
import Navbar from "@/components/Navbar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth, signOut } from "../lib/auth";
import { requireUser } from "../lib/hook";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";


async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select:{
      userName: true,
      grantId: true,
    }
  });
  if(!data?.userName){
    return redirect("/onboarding");
  }
  // if(!data?.grantId){
  //   return redirect("/onboarding/grant-id");
  // }
  return data;
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireUser();
  const data= await getData(session.user?.id as string);

  return (
      <>
    <div className="min-h-screen w-full grid md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen border-r ">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" className="h-10 w-10 mt-2" />
            <div>
              <b className="text-3xl  mt-0.5 font-bold">O</b>
              <span className="text-3xl font-bold text-blue-500">cean</span>
            </div>
          </Link>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
          <DashboardLinks />
        </nav>
      </aside>

      {/* hamburger */}
      <div className="flex flex-col">
        <header className="flex items-center h-14 bg-muted/40 gap-4 border-b px-4 lg:px-6 lg:h-[60px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="md:hidden shrink-0"
                variant={"outline"}
                size="icon"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              {/* Accessible title for screen readers only */}
              <SheetTitle className="sr-only">Ocean Navigation</SheetTitle>

              {/* Visible Logo */}
              <div className="flex items-center gap-2 px-4 pt-5">
                <Link href="/" className="flex items-center gap-2">
                  <Image src={Logo} alt="Ocean Logo" className="h-10 w-10" />
                  <div>
                    <b className="text-3xl font-bold">O</b>
                    <span className="text-3xl font-bold text-blue-500">
                      cean
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="grid gap-2 mt-2 px-4">
                <DashboardLinks />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-x-4">
            <ThemeToggle/>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'secondary'} className=" p-0 rounded-full">
                  <img src={session?.user?.image as string} alt="User Avatar" className="h-full w-full rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form className="w-full" action={async()=>{
                      "use server";
                      await signOut();
                    }} >
                      <button className="w-full text-left cursor-pointer" >Log out</button>

                    </form>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className=" flex-1 p-4">{children}</main>
      </div>
    </div>
    <Toaster richColors closeButton/>
    </>
  );
}
