import Image from "next/image";
import { AuthModel } from "./AuthModel";
import { HeroCopy } from "./landing/HeroCopy";

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] [mask-image:linear-gradient(to_bottom,white_50%,transparent_96%)] md:h-[1040px]">
        <Image
          src="/hero-light.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="block object-cover object-[68%_45%] dark:hidden"
        />
        <Image
          src="/hero-dark.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[68%_45%] dark:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-transparent via-30% to-background/90" />
      </div>

      <HeroCopy authButton={<AuthModel />} />

      <div className="h-24 md:h-60" />
    </section>
  );
}
