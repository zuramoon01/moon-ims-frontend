import type { HTMLInputAttributes } from "svelte/elements";

export interface InputProps extends Omit<HTMLInputAttributes, "value"> {
  containerClasses?: string | null;
  label?: string;
}
