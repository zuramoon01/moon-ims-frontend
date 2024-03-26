import { JWT_KEY } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

const authenticatedRoute = (pathname: string) => {
  const routes = ["/", "/transaksi"];

  return routes.some(
    (route) => route === pathname || route.startsWith(pathname),
  );
};

export const handle: Handle = ({ event, resolve }) => {
  const {
    cookies,
    url: { pathname },
  } = event;

  let user = null;

  const token = cookies.get("token");

  if (token) {
    const decode = jwt.verify(token, JWT_KEY);

    if (typeof decode !== "string" && decode.user) {
      user = decode.user;
    }
  }

  if (!user && authenticatedRoute(pathname)) {
    redirect(307, "/masuk");
  }

  const response = resolve(event);

  return response;
};
