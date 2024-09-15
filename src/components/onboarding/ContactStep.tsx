export const ContactStep = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex min-h-full flex-col gap-4">
      <article>
        <h3 className="text-2xl font-semibold tracking-wide">Contact information</h3>
        <p className="mt-1 text-muted-foreground">
          Fill in your public contact information, this is what every person you give your card to
          will see, additionally it is possible to hide it from your public page if needed.
        </p>
      </article>

      <article className="min-h-full">{children}</article>
    </section>
  );
};
