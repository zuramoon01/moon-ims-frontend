import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
} from "svelte/elements";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import type { IconProps } from "$lib/ui";

type ButtonVariant = "filled" | "secondary" | "outline" | "shadow" | "danger";

export interface BaseButtonProps {
  variant?: ButtonVariant;
  text?: string;
  icon?: IconProps;
}

export interface ButtonProps extends BaseButtonProps, HTMLButtonAttributes {
  loading?: boolean;
}

export interface LinkProps extends BaseButtonProps, HTMLAnchorAttributes {}

export const generateButtonClasses = ({
  text,
  icon,
  variant = "filled",
  classes,
  loading,
}: {
  text?: boolean;
  icon?: boolean;
  variant?: ButtonVariant;
  classes?: string | null;
  loading?: boolean;
}) => {
  const variantClasses: Record<ButtonVariant, Array<string> | string> = {
    filled: clsx(
      "bg-accent-950 text-accent-50",
      "hoverable:hover:bg-accent-700",
    ),
    secondary: clsx(
      "bg-accent-200 text-accent-950",
      "hoverable:hover:bg-accent-500",
    ),
    outline: clsx(
      "bg-accent-50 text-accent-950 shadow-border",
      "hoverable:hover:bg-accent-100",
    ),
    shadow: clsx(
      "text-accent-950",
      "hoverable:text-accent-500",
      "hoverable:hover:text-accent-950",
      "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-accent-200",
      "hoverable:disabled:hover:bg-transparent hoverable:disabled:hover:text-accent-200",
    ),
    danger: clsx("bg-red-950 text-accent-950", "hoverable:hover:bg-red-800"),
  };

  return twMerge(
    clsx(
      text && "px-4 py-2",
      (loading || (text && icon)) && "gap-2",
      !text && icon && "size-[1.875rem] shrink-0",
      "flex items-center justify-center overflow-hidden rounded",
      "disabled:cursor-not-allowed disabled:bg-accent-200 disabled:text-accent-300",
      "hoverable:disabled:hover:bg-accent-200",
      variantClasses[variant],
      classes,
    ),
  );
};
