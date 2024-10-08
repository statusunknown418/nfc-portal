import { useTranslations } from "next-intl";

export const PublicPortalStep = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("admin.onboarding.steps.portal");

  return (
    <section className="flex flex-col gap-4 pb-20 md:pb-10">
      <article>
        <h3 className="text-2xl font-semibold tracking-wide">{t("title")}</h3>
        <p className="mt-1 text-muted-foreground">{t("description")}</p>
      </article>

      <article className="flex flex-col gap-4 overflow-auto pb-12 lg:flex-row lg:gap-8">
        {children}
      </article>
    </section>
  );
};
