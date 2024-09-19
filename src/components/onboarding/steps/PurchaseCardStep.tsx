import { ShoppingBagIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { purchaseStatusToText } from "~/lib/utils";
import { api } from "~/trpc/react";
import { CardPreview } from "~/components/admin/contact/CardPreview";
import { Spinner } from "~/components/shared/Spinner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { FormItem } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export const PurchaseCardStep = () => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);

  const { data, isLoading } = api.purchases.getStatus.useQuery();
  const { mutate, isPending } = api.purchases.withPreferences.useMutation({
    onError: (err) => {
      toast.error("Something went wrong", {
        description: err.message,
      });
    },
    onSuccess: (data) => {
      if (!data.sandbox_init_point) {
        toast.error("Something went wrong", {
          description: "Unable to redirect to payment provider",
        });
      }

      window.open(data.sandbox_init_point, "_self");
    },
  });

  const [shippingAddress, setShippingAddress] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      metadata: {
        ...preferences,
        shippingAddress,
      },
      title: `NFC card | ${preferences.cardVariant.toLocaleUpperCase()} Edition`,
      cardVariant: preferences.cardVariant,
      description: `Purchase your NFC card`,
    });
  };

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

      <form
        onSubmit={onSubmit}
        className="mx-auto grid w-full max-w-sm grid-cols-1 place-items-center gap-2"
      >
        {!isLoading && data?.cardShippingStatus ? (
          <Badge className="my-4 h-7 justify-self-center">
            {purchaseStatusToText(data.cardShippingStatus)}{" "}
            {data.cardShippingStatus === "in_progress" && (
              <SparklesIcon size={15} className="ml-2 text-amber-500" />
            )}
          </Badge>
        ) : (
          <Badge className="my-3 h-7" variant="secondary">
            <Spinner />
          </Badge>
        )}

        <FormItem className="w-full max-w-sm">
          <Label>Shipping address</Label>

          <Textarea
            required
            placeholder="Your shipping address"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            autoComplete="address-line1"
            rows={2}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.currentTarget.value)}
          />
        </FormItem>

        <Button
          disabled={!shippingAddress}
          onClick={() =>
            mutate({
              metadata: preferences,
              title: `NFC card | ${preferences.cardVariant.toLocaleUpperCase()} Edition`,
              cardVariant: preferences.cardVariant,
              description: `Purchase your NFC card`,
            })
          }
          variant="primary"
          size="lg"
          className="h-12 w-full max-w-sm self-center shadow-lg shadow-indigo-300"
        >
          {isPending ? <Spinner className="text-white" /> : <ShoppingBagIcon size={15} />}

          {!isLoading && data?.cardShippingStatus !== "awaiting_purchase"
            ? "Already purchased, want another?"
            : "Buy now!"}
        </Button>

        <p className="mt-2 text-center text-muted-foreground">
          You will be redirected to our payment provider to securely complete the payment
        </p>
      </form>
    </section>
  );
};
