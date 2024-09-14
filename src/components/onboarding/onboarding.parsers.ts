import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const keys = ["contact", "portal", "nfc-card", "purchase", "finale"] as const;
export type Keys = (typeof keys)[number];

export const onboardingParsers = {
  step: parseAsStringLiteral<Keys>(keys).withDefault("contact"),
};

export const onboardingParsesCache = createSearchParamsCache(onboardingParsers);
