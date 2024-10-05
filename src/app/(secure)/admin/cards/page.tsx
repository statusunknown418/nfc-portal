import { CardPreferencesForm } from "~/components/admin/CardPreferencesForm";

export default async function CardsPage() {
  return (
    <section>
      <header>
        <h1 className="text-xl font-semibold">Get a new card!</h1>
        <p className="text-muted-foreground">
          Customize it the way you like and get it delivered to you in a snap! By the way the form
          is prefilled with your previous order.
        </p>
      </header>

      <CardPreferencesForm />
    </section>
  );
}
