import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const portalsParsers = {
  ktp: parseAsString,
};

export const portalsQueryCache = createSearchParamsCache(portalsParsers);
