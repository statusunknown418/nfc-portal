import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const contactSteps = ["personal", "work", "addresses"] as const;

export type ContactSteps = (typeof contactSteps)[number];

export const contactStepParsers = {
  step: parseAsStringLiteral<ContactSteps>(contactSteps).withDefault("personal"),
};

export const contactStepsCache = createSearchParamsCache(contactStepParsers);
