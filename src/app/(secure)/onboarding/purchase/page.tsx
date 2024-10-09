"use client";

import { ShoppingBagIcon, SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { CardPreview } from "~/components/admin/contact/CardPreview";
import { Spinner } from "~/components/shared/Spinner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { api } from "~/trpc/react";

export default function PurchasePage() {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const t = useTranslations("admin.onboarding.steps.purchaseCard");
  const messages = useTranslations("common");

  const { data: vCard, isLoading: vCardLoading } = api.vCard.get.useQuery();
  const { data, isLoading } = api.purchases.getStatus.useQuery();
  const { mutate, isPending } = api.purchases.withPreferences.useMutation({
    onError: (err) => {
      toast.error(messages("errors.somethingWentWrong"), {
        description: err.message,
      });
    },
    onSuccess: (paymentRedirectLink) => {
      if (!paymentRedirectLink) {
        toast.error(messages("errors.somethingWentWrong"), {
          description: "Unable to redirect to payment provider",
        });
      }

      window.open(paymentRedirectLink, "_self");
    },
  });

  const [shippingAddress, setShippingAddress] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      metadata: {
        ...preferences,
        shippingAddress,
        region,
        country,
      },
      title: `NFC card | ${preferences.cardVariant.toLocaleUpperCase()} Edition`,
      cardVariant: preferences.cardVariant,
      description: `Purchase your NFC card`,
    });
  };

  return (
    <section className="flex flex-col gap-1">
      <h3 className="text-xl font-semibold tracking-wide">{t("title")}</h3>
      <p className="text-muted-foreground">{t("description")}</p>

      <div className="my-4 h-[400px]">
        <CardPreview cardData={vCard?.contactJSON ?? undefined} />
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto grid w-full max-w-3xl grid-cols-1 place-items-center gap-2"
      >
        {!isLoading && data?.cardShippingStatus ? (
          <Badge className="my-4 h-7 justify-self-center">
            {t("shippingStatus", { status: data.cardShippingStatus })}{" "}
            {data.cardShippingStatus === "in_progress" && (
              <SparklesIcon size={15} className="ml-2 text-amber-500" />
            )}
          </Badge>
        ) : (
          <Badge className="my-3 h-7" variant="secondary">
            <Spinner />
          </Badge>
        )}

        <FormItem className="w-full">
          <Label>{t("address")}</Label>

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

        <div className="flex w-full justify-between gap-2">
          <FormItem className="w-full">
            <Label>City</Label>

            <Input
              required
              placeholder="Lima"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoComplete="address-level1"
              value={region}
              onChange={(e) => setRegion(e.currentTarget.value)}
            />
          </FormItem>

          <FormItem className="w-full">
            <Label>Country</Label>

            <Input
              required
              placeholder="Peru"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoComplete="country-name"
              value={country}
              onChange={(e) => setCountry(e.currentTarget.value)}
            />
          </FormItem>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="mt-2 h-12 w-full self-center shadow-lg shadow-indigo-300"
          disabled={!shippingAddress}
          onClick={() =>
            mutate({
              metadata: preferences,
              title: `NFC card | ${preferences.cardVariant.toLocaleUpperCase()} Edition`,
              cardVariant: preferences.cardVariant,
              description: t("purchase"),
            })
          }
        >
          {isPending ? <Spinner className="text-white" /> : <ShoppingBagIcon size={15} />}

          {!isLoading && data?.cardShippingStatus !== "awaiting_purchase"
            ? t("alreadyBought")
            : t("buyNow")}
        </Button>

        <p className="mt-2 text-center text-muted-foreground">{t("redirection")}</p>
      </form>
    </section>
  );
}
