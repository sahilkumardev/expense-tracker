import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/google-button";
import { Profile } from "@/components/profile";

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center gap-10">
      <Profile />

      <Button>Click me</Button>

      <GoogleButton />
    </div>
  );
}
