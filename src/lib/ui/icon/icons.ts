export interface Icon {
  viewBox: string;
  paths: Array<{
    d: string;
    fill?: string | null;
  }>;
}

export type IconName =
  | "arrowDropDown"
  | "arrowDropUp"
  | "check"
  | "chevronLeft"
  | "chevronRight"
  | "close"
  | "delete"
  | "edit"
  | "inventory"
  | "logout"
  | "menu"
  | "plus"
  | "receipt"
  | "remove";

// name: {
// 	viewBox: "0 0 24 24",
// 	paths: [
// 		{ d: "M0 ", fill: "none" },
// 		{
// 			d: "",
// 		},
// 	],
// },

export const icons: Record<IconName, Icon> = {
  arrowDropDown: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M7 10l5 5 5-5z",
      },
    ],
  },
  arrowDropUp: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M7 14l5-5 5 5z",
      },
    ],
  },
  check: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
      },
    ],
  },
  chevronLeft: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
      },
    ],
  },
  chevronRight: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
      },
    ],
  },
  close: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0V0z", fill: "none" },
      {
        d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
      },
    ],
  },
  delete: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
      },
    ],
  },
  edit: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
      },
    ],
  },
  inventory: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0V0z", fill: "none" },
      {
        d: "M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z",
      },
    ],
  },
  logout: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
      },
    ],
  },
  menu: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0V0z", fill: "none" },
      {
        d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
      },
    ],
  },
  plus: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
      },
    ],
  },
  receipt: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z",
      },
    ],
  },
  remove: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M0 0h24v24H0z", fill: "none" },
      {
        d: "M19 13H5v-2h14v2z",
      },
    ],
  },
};
