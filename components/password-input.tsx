import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function PasswordInput({
  ...props
}: React.ComponentProps<typeof InputGroupInput>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupAddon>
        <Lock />
      </InputGroupAddon>
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
