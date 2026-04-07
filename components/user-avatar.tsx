import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  name: string;
  image: string | null | undefined;
}

export function UserAvatar({
  name,
  image,
  className,
  ...props
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  return (
    <Avatar className={cn(className)} {...props}>
      <AvatarImage
        src={image as string}
        alt={name}
        className="aspect-square object-cover"
      />
      <AvatarFallback className="rounded-lg">{initials || "ET"}</AvatarFallback>
    </Avatar>
  );
}
