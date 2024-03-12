import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import type { ButtonProps, IconProps } from "$lib/ui";

type ButtonVariant = "filled" | "secondary" | "outline" | "shadow" | "danger";

export interface BaseButtonProps {
  variant?: ButtonVariant;
  text?: string;
  icon?: IconProps;
}

export const generateButtonClasses = ({
  text,
  icon,
  variant = "filled",
  classes,
  loading,
}: BaseButtonProps & {
  classes: string | null | undefined;
} & Pick<ButtonProps, "loading">) => {
  const variantClasses: Record<ButtonVariant, Array<string> | string> = {
    filled: clsx(
      "bg-accent-950 text-accent-50",
      "hover:bg-accent-800",
      "active:bg-accent-900",
      "focus:bg-accent-900",
      "disabled:cursor-not-allowed disabled:bg-accent-200 disabled:text-accent-500",
      "disabled:hover:bg-accent-200",
      "disabled:active:bg-accent-200",
      "disabled:focus:bg-accent-200",
    ),
    secondary: clsx(
      "bg-accent-200 text-accent-950",
      "hover:bg-accent-400",
      "active:bg-accent-300",
      "focus:bg-accent-300",
      "disabled:cursor-not-allowed disabled:bg-accent-200 disabled:text-accent-500",
      "disabled:hover:bg-accent-200",
      "disabled:active:bg-accent-200",
      "disabled:focus:bg-accent-200",
    ),
    outline: clsx(
      "bg-accent-50 text-accent-950 shadow-border",
      "hover:bg-accent-100",
      "active:bg-accent-50",
      "focus:bg-accent-50",
      "disabled:cursor-not-allowed disabled:text-accent-500 disabled:shadow-accent-200",
      "disabled:hover:bg-accent-50",
      "disabled:active:bg-accent-50",
      "disabled:focus:bg-accent-50",
    ),
    shadow: clsx(
      "text-accent-700",
      "hover:text-accent-950",
      "active:text-accent-900",
      "focus:text-accent-900",
      "disabled:cursor-not-allowed disabled:text-accent-500",
      "disabled:hover:text-accent-500",
      "disabled:active:text-accent-500",
      "disabled:focus:text-accent-500",
    ),
    danger: clsx(
      "bg-red-950 text-accent-950",
      "hover:bg-red-800",
      "active:bg-red-900",
      "focus:bg-red-900",
      "disabled:cursor-not-allowed disabled:bg-accent-200 disabled:text-accent-500",
      "disabled:hover:bg-accent-200",
      "disabled:active:bg-accent-200",
      "disabled:focus:bg-accent-200",
    ),
  };

  return twMerge(
    clsx(
      text && "px-4 py-2",
      (loading || (text && icon)) && "gap-2",
      !text && icon && "size-[30px] shrink-0",
      "flex items-center justify-center overflow-hidden rounded",
      variantClasses[variant],
      classes,
    ),
  );
};
