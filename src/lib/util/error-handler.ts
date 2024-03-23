import { AxiosError } from "axios";
import { ZodError, z } from "zod";
import { addToast } from "$lib/ui";
import { messageSchema } from "$lib/util";

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

    if (status === 400) {
      const { message } = z.object({ message: messageSchema }).parse(data);

      addToast({
        data: {
          state: "Error",
          description: message,
        },
      });
    } else {
      console.error({ data, status, headers });
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
