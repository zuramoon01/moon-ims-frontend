<script
  lang="ts"
  context="module"
>
  export type ToastData = {
    state: "Sukses" | "Peringatan" | "Error";
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
</script>

<div
  use:portal
  class={clsx(
    "fixed right-0 top-0 z-[9999] m-4 flex w-full max-w-[320px] flex-col items-center justify-center gap-2 text-accent-950 md:bottom-0 md:top-auto",
  )}
>
  {#each $toasts as { id, data: { state, message } } (id)}
    <div
      use:melt={$content(id)}
      class="relative flex w-full flex-col items-start justify-center gap-2 rounded-lg bg-accent-100 p-4 shadow-border"
    >
      <div class="flex h-4 w-full items-center justify-between gap-2">
        <h3
          use:melt={$title(id)}
          class="flex items-center gap-2 text-base font-semibold leading-none"
        >
          {state}

          <span
            class={clsx(
              "size-2 rounded-full",
              state === "Sukses" && "bg-green-500",
              state === "Peringatan" && "bg-yellow-500",
              state === "Error" && "bg-red-500",
            )}
          />
        </h3>

        <button
          use:melt={$close(id)}
          class={"hover:text-accent-800"}
        >
          <Icon props={{ name: "close", classes: clsx("size-5") }} />
        </button>
      </div>

      <span
        use:melt={$description(id)}
        class="flex items-center gap-2 text-sm leading-normal"
      >
        {message}
      </span>
    </div>
  {/each}
</div>
