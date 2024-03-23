<script lang="ts">
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { melt } from "@melt-ui/svelte";
  import clsx from "clsx";
  import {
    toaster,
    Icon,
    generateButtonClasses,
    type ToastState,
  } from "$lib/ui";

  const {
    elements: { content, title: titleEl, description: descriptionEl, close },
    states: { toasts },
    actions: { portal },
  } = toaster;

  const toastStateClass: Record<ToastState, Array<string> | string> = {
    Sukses: "bg-green-500",
    Peringatan: "bg-yellow-500",
    Error: "bg-red-500",
  };
</script>

<div
  use:portal
  class={clsx(
    $toasts.length === 0 && "pointer-events-none",
    "fixed right-[50%] top-0 z-50 flex w-full max-w-[25rem] translate-x-[50%] flex-col items-center justify-center gap-2 p-4",
    "tablet:bottom-0 tablet:right-0 tablet:top-auto tablet:translate-x-0 tablet:px-8",
  )}
>
  {#each $toasts as { id, data: { state, title, description } } (id)}
    <div
      use:melt={$content(id)}
      animate:flip={{ duration: 300, easing: cubicInOut }}
      in:fly={{ duration: 150, y: "100%", easing: cubicInOut }}
      out:fly={{ duration: 150, x: "100%", easing: cubicInOut }}
      class="flex w-full flex-col items-start gap-2 overflow-auto rounded bg-accent-50 p-4 shadow-border"
    >
      <div class="flex h-4 w-full items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <h3
            use:melt={$titleEl(id)}
            class="text-sm font-medium leading-none"
          >
            {title || state}
          </h3>

          <div
            class={clsx("size-2 rounded-full", toastStateClass[state])}
          ></div>
        </div>

        <button
          use:melt={$close(id)}
          aria-label="close notification"
          class={generateButtonClasses({ icon: true, variant: "shadow" })}
        >
          <div class="flex h-[0.875rem] items-center justify-center">
            <Icon
              props={{
                name: "close",
                classes: clsx("size-5 shrink-0"),
              }}
            />
          </div>
        </button>
      </div>

      <p
        use:melt={$descriptionEl(id)}
        class="w-full text-sm leading-tight text-accent-500"
      >
        {description}
      </p>
    </div>
  {/each}
</div>
