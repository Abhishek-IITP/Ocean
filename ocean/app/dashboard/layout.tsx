import Link from "next/link";
import { ReactNode } from "react";
import { DashboardLinks } from "@/components/DashboardLinks";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "../lib/auth";
import { requireUser } from "../lib/hook";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/Logo";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: { userName: true, grantId: true },
  });
  if (!data?.userName) redirect("/onboarding");
  if (!data?.grantId) redirect("/onboarding/grant-id");
  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  await getData(session.user?.id as string);

  return (
    <>
      <div className="grid min-h-screen w-full bg-background md:grid-cols-[248px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen flex-col border-r border-border/60 bg-sidebar md:flex">
          <div className="flex h-16 items-center border-b border-border/60 px-6">
            <Logo />
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <DashboardLinks />
          </nav>
          <div className="border-t border-border/60 p-4">
            <Button asChild className="w-full" size="sm">
              <Link href="/dashboard/new">
                <Plus className="size-4" /> New event type
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-5 backdrop-blur-md md:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="md:hidden" variant="outline" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-sidebar">
                <SheetTitle className="sr-only">Ocean navigation</SheetTitle>
                <div className="px-4 pt-6">
                  <Logo />
                </div>
                <nav className="mt-8 px-4">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-9 overflow-hidden rounded-full border border-border transition-transform hover:-translate-y-px">
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt="Your avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center bg-accent/50 text-sm font-semibold text-sage-deep">
                        {session?.user?.name?.[0] ?? "O"}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuLabel>
                    {session?.user?.name ?? "My account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <button className="w-full cursor-pointer text-left">
                        Log out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-5 py-8 md:px-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors closeButton />
    </>
  );
}
