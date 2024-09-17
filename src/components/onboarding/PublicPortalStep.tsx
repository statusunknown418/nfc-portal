export const PublicPortalStep = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col gap-4 pb-20 md:pb-10">
      <article>
        <h3 className="text-2xl font-semibold tracking-wide">Portal customization</h3>
        <p className="mt-1 text-muted-foreground">
          You can customize your public page to your liking here, templates are also available
        </p>
      </article>

      <article className="flex flex-col gap-4 overflow-auto pb-12 lg:flex-row lg:gap-8">
        {children}
      </article>
    </section>
  );
};
