import { BACKEND_URL } from "$env/static/private";
import { type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ fetch, url }) => {
  return fetch(
    `${BACKEND_URL}/api/v1/products?${new URLSearchParams(
      Array.from(url.searchParams.entries()),
    ).toString()}`,
  );
};
