import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const onboardingKeys = [
  "start",
  "contact",
  "portal",
  "nfc-card",
  "purchase",
  "finale",
] as const;
export type OnboardingKeys = (typeof onboardingKeys)[number];

export const onboardingParsers = {
  step: parseAsStringLiteral<OnboardingKeys>(onboardingKeys).withDefault("start"),
};

export const onboardingParsesCache = createSearchParamsCache(onboardingParsers);
