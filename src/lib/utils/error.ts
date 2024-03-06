import { ZodError } from "zod";

export const handleError = (error: unknown, message: string) => {
  console.error(`Error : ${message}`);

  if (error instanceof TypeError) {
    handleFetchError(error);
  } else if (error instanceof ZodError) {
    handleZodError(error);
  } else {
    console.error(error);
  }
};

const handleFetchError = (error: TypeError) => {
  console.error({ ...error });
};

const handleZodError = (error: ZodError) => {
  console.error(error.format());
};
