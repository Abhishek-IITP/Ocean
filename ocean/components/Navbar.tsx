import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.ico"; // Adjust the path as necessary
import { AuthModel } from "./AuthModel";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    return (
        <div className="flex py-3.5 items-center justify-between shadow-md px-4">
            <Link href={"/"} className="flex items-center">
                <Image src={logo} alt="Logo" className="h-16 w-14  " />
                <b className="text-xl  font-bold">O</b><span className="text-xl font-bold text-blue-500">cean</span>
            </Link>

            <div className="flex items-center gap-4">
                <ThemeToggle/>
            <AuthModel/>
            </div>
        </div>
    );
}
