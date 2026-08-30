"use client";

import { MoonStars, SunHorizon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";

type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = Exclude<ThemeMode, "system">;

const storageKey = "startime-theme";

function isThemeMode(value: string | null): value is Exclude<ThemeMode, "system"> {
  return value === "light" || value === "dark";
}

function resolveTheme(mode: ThemeMode, prefersLight: boolean) {
  return mode === "system" ? (prefersLight ? "light" : "dark") : mode;
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [effectiveTheme, setEffectiveTheme] =
    useState<ResolvedTheme>("dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const stored = window.localStorage.getItem(storageKey);
    const initialMode: ThemeMode = isThemeMode(stored) ? stored : "system";
    const initialTheme = resolveTheme(initialMode, media.matches);
    const stateTimer = window.setTimeout(() => {
      setMode(initialMode);
      setEffectiveTheme(initialTheme);
    }, 0);

    const apply = (nextMode: ThemeMode) => {
      const theme = resolveTheme(nextMode, media.matches);
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.themeMode = nextMode;
    };
    const onPreferenceChange = () => {
      if (!window.localStorage.getItem(storageKey)) {
        apply("system");
        setEffectiveTheme(resolveTheme("system", media.matches));
      }
    };

    apply(initialMode);
    media.addEventListener("change", onPreferenceChange);
    return () => {
      window.clearTimeout(stateTimer);
      media.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  const nextMode: ThemeMode =
    mode === "system"
      ? effectiveTheme === "light"
        ? "dark"
        : "light"
      : mode === "light"
        ? "dark"
        : "system";
  const labels =
    locale === "ar"
      ? {
          dark: "الوضع الداكن",
          light: "الوضع الفاتح",
          system: "حسب إعداد الجهاز",
        }
      : {
          dark: "Dark theme",
          light: "Light theme",
          system: "Use device theme",
        };

  const selectMode = () => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    setMode(nextMode);
    if (nextMode === "system") window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, nextMode);
    document.documentElement.dataset.theme = resolveTheme(
      nextMode,
      media.matches,
    );
    setEffectiveTheme(resolveTheme(nextMode, media.matches));
    document.documentElement.dataset.themeMode = nextMode;
  };

  return (
    <button
      aria-label={`${labels[mode]}. ${locale === "ar" ? "التبديل إلى" : "Switch to"} ${labels[nextMode]}`}
      className="theme-toggle"
      onClick={selectMode}
      title={labels[mode]}
      type="button"
    >
      {effectiveTheme === "light" ? (
        <SunHorizon aria-hidden weight="duotone" />
      ) : (
        <MoonStars aria-hidden weight="bold" />
      )}
    </button>
  );
}
