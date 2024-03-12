import { AxiosError } from "axios";
import { ZodError, z } from "zod";
import { addToast } from "../ui";
import { messageSchema } from ".";

export const handleError = (error: unknown, message: string) => {
  console.log(`Error : ${message}`);

  if (error instanceof AxiosError) {
    handleAxiosError(error);
  } else if (error instanceof ZodError) {
    handleZodError(error);
  } else {
    console.log(error);
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
          message: message,
        },
      });
    } else {
      console.log({ data, status, headers });
    }
  } else if (request) {
    console.log(request);
  } else {
    console.log("Error", message);
  }
  console.log(config);
};

const handleZodError = (error: ZodError) => {
  console.log(error.format());
};
