import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.ico"; // Adjust the path as necessary
import { AuthModel } from "./AuthModel";

export default function Navbar() {
    return (
        <div className="flex py-3.5 items-center justify-between bg-white shadow-md px-4">
            <Link href={"/"} className="flex items-center">
                <Image src={logo} alt="Logo" className="h-16 w-14  " />
                <b className="text-xl text-black font-bold">O</b><span className="text-xl font-bold text-blue-500">cean</span>
            </Link>
            <nav className="space-x-4">
                <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
            </nav>
            <AuthModel/>
        </div>
    );
}
