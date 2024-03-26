import { AxiosError } from "axios";
import { ZodError, z } from "zod";
import { addToast } from "$lib/ui";
import { Route, messageSchema } from "$lib/util";
import { goto } from "$app/navigation";

export const handleError = (error: unknown, message: string) => {
  console.error(`Error : ${message}`);

  if (error instanceof AxiosError) {
    handleAxiosError(error);
  } else if (error instanceof ZodError) {
    handleZodError(error);
  } else {
    console.error(error);
  }
};

const handleAxiosError = ({
  response,
  request,
  message,
  config,
}: AxiosError) => {
  if (response) {
    const { data, status, headers } = response;

    const result = z.object({ message: messageSchema }).safeParse(data);

    if (result.success) {
      addToast({
        data: {
          state: "Error",
          description: result.data.message,
        },
      });
    }

    switch (status) {
      case 400:
        break;
      case 401:
        goto(Route.Login);
        break;
      default:
        console.error({ data, status, headers });
        break;
    }
  } else if (request) {
    console.error(request);
  } else {
    console.error("Error", message);
  }
  console.error(config);
};

const handleZodError = (error: ZodError) => {
  console.error(error.format());
};
