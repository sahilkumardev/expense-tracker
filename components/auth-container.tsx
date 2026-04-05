import Image from "next/image";
import { Logo } from "./logo";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 items-center h-svh md:h-screen">
      <Image
        height={1000}
        width={1000}
        src="/auth.jpg"
        alt="Background"
        loading="eager"
        className="object-cover col-span-2 w-full h-screen hidden md:block"
      />

      <section className="px-9 py-10 grid grid-cols-1 content-between h-screen">
        <Logo />
        {children}
        <div className="flex items-center justify-between">
          <Logo logoOnly />

          <p>
            <span className="-mt-0.5">@</span>Expense Tracker
          </p>
        </div>
      </section>
    </main>
  );
}
