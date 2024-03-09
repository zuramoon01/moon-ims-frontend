import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { Socket, io } from "socket.io-client";
import type {
  NewOrUpdateProduct,
  Product,
  SearchParamsProduct,
} from "$lib/entity";

export interface ServerToClientEvents {
  "product:getAll": () => void;
}

export interface ClientToServerEvents {
  "product:getAll": (
    params: SearchParamsProduct,
    callback: (response: any) => void,
  ) => Promise<void>;
  "product:add": (
    data: NewOrUpdateProduct,
    callback: (response: any) => void,
  ) => Promise<void>;
  "product:update": (
    id: Product["id"],
    data: NewOrUpdateProduct,
    callback: (response: any) => void,
  ) => Promise<void>;
  "product:delete": (
    id: Product["id"],
    callback: (response: any) => void,
  ) => Promise<void>;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  PUBLIC_BACKEND_URL,
  {
    withCredentials: true,
  },
);

socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

export { socket };
