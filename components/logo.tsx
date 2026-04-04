import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 px-1.5 h-14 border-b">
      <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </div>
      <span className="text-sm font-bold">Expense Tracker</span>
    </div>
  );
}
