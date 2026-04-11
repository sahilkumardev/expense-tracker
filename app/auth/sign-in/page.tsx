import { Metadata } from "next";
import { SignInForm } from "@/components/form-sign-in";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth-ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <main>
      <h1 className="text-3xl md:text-4xl font-medium font-machine tracking-tight mb-4">
        👋 Welcome back!
      </h1>

      <SignInForm />

      <div className="flex items-center my-6">
        <Separator className="shrink" />
        <span className="text-nowrap mx-3 text-sm text-muted-foreground">
          or continue with
        </span>
        <Separator className="shrink" />
      </div>

      <GoogleButton />

      <p className="text-center text-sm -mb-4 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="hover:underline underline-offset-4 text-muted-foreground hover:text-foreground/90"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
