import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

export function PasswordInput({
  ...props
}: React.ComponentProps<typeof InputGroupInput>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupAddon>
        <Lock />
      </InputGroupAddon>
      <Separator
        orientation="vertical"
        className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
      />
      <InputGroupInput
        id="password"
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <InputGroupAddon
        align="inline-end"
        className="cursor-default"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
