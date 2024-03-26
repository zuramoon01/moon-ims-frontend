<script lang="ts">
  import clsx from "clsx";
  import { Button, Input, addToast } from "$lib/ui";
  import { Route, handleError, messageSchema } from "$lib/util";
  import { apiMoonIMS } from "$lib/api";
  import { goto } from "$app/navigation";

  let input = {
    name: "",
    password: "",
  };

  let processState: "idle" | "loading" = "idle";
  const login = async () => {
    try {
      const { status, data } = await apiMoonIMS.post(`${Route.Api.Login}`, {
        ...input,
      });

      if (!data.message) {
        console.error("Fungsi login Halaman Masuk no message");

        processState = "idle";

        return;
      }

      const message = messageSchema.parse(data.message);

      if (status !== 200) {
        console.error("Fungsi login Halaman Masuk status not 200");

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

      await goto(Route.Product);
    } catch (error) {
      handleError(error, "Fungsi login Halaman Masuk");
    }
  };
</script>

<main class="flex w-full items-center justify-center p-4">
  <form
    on:submit|preventDefault={login}
    class="flex w-full max-w-[25rem] flex-col gap-4 overflow-hidden rounded px-4 py-8 shadow-border"
  >
    <header class="flex w-full items-center">
      <h1 class="text-2xl font-medium leading-none">Masuk</h1>
    </header>

    <div class="flex w-full flex-col items-start gap-2">
      <Input
        props={{
          label: "Nama",
          type: "text",
          id: "name",
          name: "name",
        }}
        bind:value={input.name}
      />

      <Input
        props={{
          label: "Kata Sandi",
          type: "password",
          id: "password",
          name: "password",
        }}
        bind:value={input.password}
      />
    </div>

    <footer>
      <Button
        props={{
          type: "submit",
          text: "Masuk",
          class: clsx("w-full"),
          loading: processState === "loading",
        }}
      />
    </footer>
  </form>
</main>
