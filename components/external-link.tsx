import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const externalLinkVariants = cva(
  "hover:underline underline-offset-4 text-muted-foreground text-sm group whitespace-nowrap inline-flex items-center gap-0.5  text-muted-foreground hover:text-foreground font-inter tracking-wider leading-4 transition-colors duration-200",
  {
    variants: {
      size: {
        default: "[&_svg:not([class*='size-'])]:size-10",
        sm: "[&_svg:not([class*='size-'])]:size-6",
        md: "[&_svg:not([class*='size-'])]:size-8",
        lg: "[&_svg:not([class*='size-'])]:size-12",
      },
      underline: {
        default: "no-underline",
        true: "underline",
      },
      text: {
        default: "text-sm",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
    defaultVariants: {
      size: "default",
      underline: "default",
      text: "default",
    },
  },
);

export function ExternalLink({
  className,
  children,
  href,
  size,
  underline,
  text,
  hideIcon = false,
  ...props
}: React.ComponentProps<typeof Link> &
  VariantProps<typeof externalLinkVariants> & { hideIcon?: boolean }) {
  return (
    <Link
      className={cn(externalLinkVariants({ size, underline, text, className }))}
      href={href}
      {...props}
    >
      {children}

      {hideIcon && (
        <ArrowRight
          className="text-foreground/60 opacity-0 group-hover:opacity-100 size-4 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
