import { TelevisionSimple } from "@phosphor-icons/react/dist/ssr";
import Meteors from "~/components/magicui/meteors";
import { LocaleSwitcherWrapper } from "~/components/shared/locale-switcher";

export default function SettingsPage() {
  return (
    <section className="grid h-full w-full place-items-center">
      <article className="mx-auto flex w-full max-w-prose flex-col items-center gap-2 text-center">
        <TelevisionSimple size={36} />

        <h1 className="text-lg font-semibold">
          We will be adding more features and settings soon! Stay tuned!
        </h1>

        <p>
          If you need to manage your account, just click on your avatar in the top right corner. You
          can also change the language via the button below this message.
        </p>

        <div className="mt-2 w-max">
          <LocaleSwitcherWrapper />
        </div>
      </article>

      <Meteors />
    </section>
  );
}
