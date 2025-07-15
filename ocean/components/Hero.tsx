import Image from "next/image";
import { AuthModel } from "./AuthModel";
import HeroImage from '@/public/hero.png'

export function Hero() {
  return (
<section className="relative flex flex-col items-center justify-center py-12 lg:py-20 
    bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 
    dark:bg-gradient-to-br dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:via-transparent before:to-cyan-500/10
    dark:before:from-blue-400/20 dark:before:via-transparent dark:before:to-cyan-400/20">
    <div className="relative z-10 text-center">
        <span className="text-lg text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full">Introducing Ocean</span>
        <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-medium tracking-tight leading-none">
            Scheduling made <span className="text-primary block -mt-2">super easy!</span>
        </h1>
        <p className="max-w-xl mx-auto mt-8 lg:text-lg  text-muted-foreground">
            Scheduling a meeting shouldn't be a hassle. Ocean makes it easy to find the perfect time for everyone.
        </p>

        <div className="mt-5 mb-12">
            <AuthModel/>
        </div>
    </div>

    <div className="relative items-center w-full py-12 mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8
        bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-cyan-100/80
        dark:bg-gradient-to-r dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-slate-800/40
        backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-lg shadow-xl">
            <Image src={HeroImage} alt="Ocean - Scheduling made easy" className="object-cover relative w-full border border-blue-200/30 dark:border-blue-700/30 rounded-lg shadow-2xl lg:rounded-2xl" />

    </div>
</section>
  );
}