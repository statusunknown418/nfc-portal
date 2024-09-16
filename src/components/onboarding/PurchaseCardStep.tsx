import { ShoppingBagIcon } from "lucide-react";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";
import { CardPreview } from "../admin/contact/CardPreview";
import { Button } from "../ui/button";

export const PurchaseCardStep = ({
  onPurchase,
}: {
  onPurchase: (data: SaveNFCPreferences) => Promise<string>;
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);

  return (
    <section className="flex min-h-full flex-col gap-1">
      <h3 className="text-xl font-semibold tracking-wide">Purchase your NFC card</h3>
      <p className="text-muted-foreground">
        Your card will be delivered as soon as possible and the way you customized it in the
        previous step.
      </p>

      <div className="my-4 h-[400px]">
        <CardPreview />
      </div>

      <Button
        onClick={() => void onPurchase(preferences)}
        variant="primary"
        size="lg"
        className="h-12 w-full max-w-sm self-center shadow-lg shadow-indigo-300"
      >
        <ShoppingBagIcon size={15} />
        Buy now
      </Button>

      <p className="mt-2 self-center text-balance text-muted-foreground">
        You will be redirected to our payment provider to securely complete the payment
      </p>
    </section>
  );
};
