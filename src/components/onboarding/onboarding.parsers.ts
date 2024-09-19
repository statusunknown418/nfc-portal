import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const keys = ["start", "contact", "portal", "nfc-card", "purchase", "finale"] as const;
export type Keys = (typeof keys)[number];

export const onboardingParsers = {
  step: parseAsStringLiteral<Keys>(keys).withDefault("start"),
};

export const onboardingParsesCache = createSearchParamsCache(onboardingParsers);
