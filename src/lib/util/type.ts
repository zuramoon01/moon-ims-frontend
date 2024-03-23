export type BaseConfig = {
  currentPage: number;
  totalPage: number;
  from: number;
  to: number;
  limit: number;
  total: number;
};

export type ExtendedConfig<Key> = {
  currentPageInString: string;
  limitInString: string;
  orderByKey: Key | null;
  sortDirection: "ASC" | "DESC";
};
