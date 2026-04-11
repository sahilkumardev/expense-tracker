import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BookOpenText,
  ChevronDown,
  CreditCard,
  LifeBuoy,
  Mail,
  MessageSquareText,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "Manage Transactions",
    description: "Add, edit, and organize your transaction records.",
    href: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Update Account Settings",
    description: "Edit your profile, security options, and categories.",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "View Security Guide",
    description: "Learn best practices for password and session safety.",
    href: "/dashboard/settings",
    icon: ShieldCheck,
  },
];

const faqItems = [
  {
    question: "How do I add a new expense?",
    answer:
      "Go to Transactions, choose a category, enter amount and date, then save. New entries appear at the top of your activity list.",
  },
  {
    question: "Can I edit or delete categories later?",
    answer:
      "Yes. Open Settings and use category management to rename, recolor, or remove categories that are no longer needed.",
  },
  {
    question: "What should I do if I see unknown account activity?",
    answer:
      "Open Settings and use logout all devices. Then reset your password and review your latest transactions.",
  },
  {
    question: "Why am I seeing offline mode?",
    answer:
      "The app checks browser network status. Reconnect to the internet and refresh to sync your newest data.",
  },
];

const supportChannels = [
  {
    title: "Email Support",
    detail: "support@expense-tracker.dev",
    note: "Typical response time: within 24 hours",
    icon: Mail,
  },
  {
    title: "Live Chat",
    detail: "Mon-Sat, 9:00 AM to 7:00 PM",
    note: "Fastest for account and billing questions",
    icon: MessageSquareText,
  },
  {
    title: "Knowledge Base",
    detail: "Guides, setup help, and feature walkthroughs",
    note: "Self-serve documentation for common tasks",
    icon: BookOpenText,
  },
];

export default function HelpPage() {
  return (
    <section className="space-y-6 min-w-0">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="min-w-0 border-border/60 bg-linear-to-b from-card via-card to-muted/20"
          >
            <CardHeader className="space-y-3 pb-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <action.icon className="size-4 text-primary" />
              </span>
              <CardTitle className="text-base leading-tight wrap-break-word">
                {action.title}
              </CardTitle>
              <CardDescription className="text-pretty wrap-break-word">
                {action.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link
                  href={action.href}
                  className="inline-flex items-center gap-1.5"
                >
                  Open
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="min-w-0 border-border/60 bg-linear-to-b from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LifeBuoy className="size-4 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick solutions for common expense tracking questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group min-w-0 rounded-xl border border-border/70 bg-background/60 px-4 py-3"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-medium">
                  <span className="min-w-0 wrap-break-word">
                    {item.question}
                  </span>
                  <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground wrap-break-word text-pretty">
                  {item.answer}
                </p>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/60 bg-linear-to-b from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="size-4 text-primary" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Choose a support path based on your issue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportChannels.map((channel) => (
              <div
                key={channel.title}
                className="min-w-0 rounded-xl border border-border/70 bg-background/60 p-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <channel.icon className="size-4 text-primary" />
                  </span>
                  <p className="min-w-0 text-sm font-medium wrap-break-word">
                    {channel.title}
                  </p>
                </div>
                <p className="mt-2 break-all text-sm text-muted-foreground">
                  {channel.detail}
                </p>
                <Badge
                  variant="outline"
                  className="mt-2 h-auto max-w-full whitespace-normal py-1 leading-relaxed wrap-break-word"
                >
                  {channel.note}
                </Badge>
              </div>
            ))}

            <Button className="w-full" asChild>
              <Link
                href="mailto:support@expense-tracker.dev"
                className="inline-flex min-w-0 items-center justify-center gap-1.5"
              >
                Create Support Ticket
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
