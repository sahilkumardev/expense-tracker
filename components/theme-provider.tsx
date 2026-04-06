"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: "class" | "data-theme";
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function parseStoredTheme(value: string | null): Theme | null {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return null;
}

function withTransitionDisabled(action: () => void) {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important;animation:none!important}",
    ),
  );
  document.head.appendChild(style);

  action();

  window.getComputedStyle(document.body);
  requestAnimationFrame(() => {
    style.remove();
  });
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "class",
  enableSystem = true,
  enableColorScheme = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      setSystemTheme(media.matches ? "dark" : "light");
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  React.useEffect(() => {
    const storedTheme = parseStoredTheme(localStorage.getItem(storageKey));
    if (storedTheme) {
      setThemeState(storedTheme);
      return;
    }

    setThemeState(defaultTheme);
  }, [defaultTheme, storageKey]);

  const resolvedTheme =
    theme === "system" ? (enableSystem ? systemTheme : "dark") : theme;

  React.useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(resolvedTheme);
      } else {
        root.setAttribute(attribute, resolvedTheme);
      }

      if (enableColorScheme) {
        root.style.colorScheme = resolvedTheme;
      }
    };

    if (disableTransitionOnChange) {
      withTransitionDisabled(applyTheme);
    } else {
      applyTheme();
    }

    if (theme === "system") {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, theme);
    }
  }, [
    attribute,
    disableTransitionOnChange,
    enableColorScheme,
    resolvedTheme,
    storageKey,
    theme,
  ]);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
