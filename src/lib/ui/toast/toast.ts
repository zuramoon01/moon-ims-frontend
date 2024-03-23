import { createToaster } from "@melt-ui/svelte";

export type ToastState = "Sukses" | "Peringatan" | "Error";

export type ToastData = {
  state: ToastState;
  title?: string;
  description: string;
};

export const toaster = createToaster<ToastData>();

export const addToast = toaster.helpers.addToast;
