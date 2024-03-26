<script lang="ts">
  import { page } from "$app/stores";
  import { twMerge } from "tailwind-merge";
  import clsx from "clsx";
  import { appStore } from "$lib/store";
  import { Button, Link, addToast, navs } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";
  import { apiMoonIMS } from "$lib/api";
  import { goto } from "$app/navigation";

  let processState: "idle" | "loading" = "idle";
  const logout = async () => {
    try {
      const { status, data } = await apiMoonIMS.post(`${Route.Api.Logout}`);

      if (!data.message) {
        console.error("Fungsi logout no message");

        processState = "idle";

        return;
      }

      const message = messageSchema.parse(data.message);

      if (status !== 200) {
        console.error("Fungsi logout status not 200");

        processState = "idle";

        return;
      }

      addToast({
        data: {
          state: "Sukses",
          description: message,
        },
      });

      processState = "idle";

      await goto(Route.Login);
    } catch (error) {
      handleError(error, "Fungsi logout");
    }
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={clsx(
    "fixed left-0 top-0 z-0 h-full w-full cursor-pointer bg-accent-50/50",
    "tablet:hidden",
    !$appStore.showSidebar && "hidden",
  )}
  on:click={() => {
    appStore.toggleSidebar(false);
  }}
></div>

<aside
  class={twMerge(
    clsx(
      "fixed top-0 z-10 flex h-full w-full max-w-sidebar flex-col items-start justify-between gap-8 overflow-hidden bg-accent-50 p-4 shadow-border-inner-r transition-all duration-500",
      $appStore.showSidebar ? "left-0" : "-left-sidebar",
      "tablet:left-0",
    ),
  )}
>
  <header class="flex w-full flex-col items-start gap-1">
    <div
      class="flex h-12 w-full items-center justify-between gap-4 pb-4 shadow-border-inner-b"
    >
      <h2 class="text-lg font-extrabold leading-none text-accent-950">
        Toko Bangunan Dayat
      </h2>

      <Button
        props={{
          type: "button",
          icon: {
            name: "close",
          },
          class: clsx("tablet:hidden"),
        }}
        on:click={() => {
          appStore.toggleSidebar(false);
        }}
      />
    </div>

    <nav class="flex w-full flex-col items-start gap-1">
      {#each navs as nav, i (i)}
        <Link
          props={{
            ...nav,
            variant: $page.url.pathname === nav.href ? "filled" : "shadow",
            class: clsx(
              $page.url.pathname === nav.href && "pointer-events-none",
              "flex justify-start w-full",
            ),
          }}
        />
      {/each}
    </nav>
  </header>

  <footer class="flex w-full flex-col items-start">
    <Button
      props={{
        type: "button",
        variant: "outline",
        text: "Keluar",
        icon: {
          name: "logout",
        },
        class: clsx("flex justify-start w-full"),
        loading: processState === "loading",
      }}
      on:click={logout}
    />
  </footer>
</aside>
