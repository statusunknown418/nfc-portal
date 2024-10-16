import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";
import { onboardingKeys, type OnboardingStep } from "~/server/db/schema";

export const onboardingParsers = {
  step: parseAsStringLiteral<OnboardingStep>(onboardingKeys).withDefault("start"),
};

export const onboardingParsesCache = createSearchParamsCache(onboardingParsers);
