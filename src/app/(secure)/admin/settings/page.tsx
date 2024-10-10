"use client";

import { ClerkLoading, UserButton } from "@clerk/nextjs";
import { TelevisionSimple } from "@phosphor-icons/react";
import Meteors from "~/components/magicui/meteors";
import { Skeleton } from "~/components/ui/skeleton";

export default function SettingsPage() {
  return (
    <section className="grid h-full w-full place-items-center">
      <article className="flex flex-col items-center gap-2">
        <TelevisionSimple size={36} />

        <h1 className="text-lg font-semibold">
          We will be adding more features and settings soon! Stay tuned!
        </h1>
        <p>
          If you need to manage your account, just click on your avatar in the top left corner or
          the button below this message.
        </p>

        <div className="mt-2 w-max">
          <ClerkLoading>
            <Skeleton className="h-20 w-52 rounded-full border" />
          </ClerkLoading>

          <UserButton
            showName
            userProfileProps={{
              appearance: {
                elements: {
                  profileSectionPrimaryButton__username: "hidden",
                },
              },
            }}
            appearance={{
              elements: {
                userButtonTrigger: "rounded-full border py-2 px-2.5",
                userButtonAvatarBox: "w-20 h-20",
                profileSectionPrimaryButton__username: "hidden",
                userPreviewSecondaryIdentifier: "font-semibold tracking-wide",
              },
            }}
          />
        </div>
      </article>

      <Meteors />
    </section>
  );
}
