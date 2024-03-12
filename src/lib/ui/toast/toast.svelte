<script
  lang="ts"
  context="module"
>
  export type ToastState = "Sukses" | "Peringatan" | "Error";

  export type ToastData = {
    state: ToastState;
    message: string;
  };

  const {
    elements: { content, title, description, close },
    helpers,
    states: { toasts },
    actions: { portal },
  } = createToaster<ToastData>();

  export const addToast = helpers.addToast;
</script>

<script lang="ts">
  import { createToaster, melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import { Icon } from "$lib/ui";

  const toastStateClass: Record<ToastState, Array<string> | string> = {
    Sukses: "bg-green-500",
    Peringatan: "bg-yellow-500",
    Error: "bg-red-500",
  };
</script>

<div
  use:portal
  class={clsx(
    "fixed right-0 top-0 z-40 flex flex-col items-center justify-center gap-2 px-4 py-4",
    "max-[560px]:w-full",
    "sm:bottom-0 sm:top-auto",
    "md:px-8",
  )}
>
  {#each $toasts as { id, data: { state, message } } (id)}
    <div
      use:melt={$content(id)}
      class={clsx(
        "flex w-[40ch] flex-col items-start justify-center gap-1 overflow-auto rounded-md bg-accent-100 p-4 shadow-border",
        "max-[560px]:w-full",
      )}
    >
      <div class="flex h-4 w-full items-center justify-between gap-4">
        <h3
          use:melt={$title(id)}
          class="flex items-center gap-2 text-base font-semibold leading-none text-accent-950"
        >
          {state}

          <div
            class={clsx(
              "size-2 rounded-full text-accent-950",
              toastStateClass[state],
            )}
          ></div>
        </h3>

        <button use:melt={$close(id)}>
          <Icon
            props={{
              name: "close",
              classes: clsx("size-4 text-accent-500", "hover:text-accent-950"),
            }}
          />
        </button>
      </div>

      <span
        use:melt={$description(id)}
        class="flex items-center text-sm leading-tight text-accent-800"
      >
        {message}
      </span>
    </div>
  {/each}
</div>
