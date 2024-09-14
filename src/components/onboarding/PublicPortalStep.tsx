export const PublicPortalStep = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex min-h-full flex-col gap-4 md:flex-row md:justify-between">
      <article>
        <h3>Portal customization</h3>
        <p>You can customize your public page to your liking here, templates are also available</p>
      </article>
      <article className="min-h-full">{children}</article>
    </section>
  );
};
