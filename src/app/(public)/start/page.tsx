import { ArrowDown, ShoppingCartSimple, Sparkle, Truck } from "@phosphor-icons/react/dist/ssr";
import { type Metadata, type Viewport } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import BlurFade from "~/components/magicui/blur-fade";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import FlickeringGrid from "~/components/ui/flickering-grid";

export const metadata: Metadata = {
  title: "Start - ConCard",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#171717",
};

export default function StartNowPage() {
  const t = useTranslations("landing");

  return (
    <main className="relative grid h-full w-full grid-cols-1 text-foreground">
      <section className="dark relative flex h-svh w-full flex-col items-center justify-center bg-neutral-900">
        <FlickeringGrid
          className="absolute inset-0 z-0 w-full bg-neutral-950"
          flickerChance={0.4}
          squareSize={7}
          gridGap={8}
          color="#374151"
        />

        <article className="z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:gap-14 lg:px-8">
          <BlurFade delay={0.5}>
            <div className="flex flex-col items-center gap-4">
              <Badge variant="secondary" size="md" className="dark w-max border border-neutral-700">
                <Truck className="size-5" weight="duotone" />
                Envío gratis a todo Lima
              </Badge>

              <Badge variant="indigo" className="w-max" size="md">
                <Sparkle className="size-5" weight="duotone" />
                Aprovecha la oferta de S/. 49.90 PEN por tiempo limitado! <sup>1</sup>
              </Badge>
            </div>
          </BlurFade>

          <BlurFade>
            <h1 className="dark text-balance text-6xl font-light tracking-tight text-foreground">
              <span className="bg-gradient-to-b from-foreground to-indigo-500 bg-clip-text font-semibold italic text-transparent">
                Mejora
              </span>{" "}
              tu manera de hacer{" "}
              <span className="bg-gradient-to-b from-foreground to-indigo-500 bg-clip-text font-semibold italic text-transparent">
                Networking
              </span>
              , y{" "}
              <span className="bg-gradient-to-b from-foreground to-indigo-500 bg-clip-text font-semibold italic text-transparent">
                destaca
              </span>{" "}
              entre la competencia.{" "}
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="-mt-8 text-balance text-xl text-neutral-400">
              Únete a los miles de profesionales y empresarios que confían en{" "}
              <span className="font-semibold">ConCard</span>
            </p>
          </BlurFade>

          <BlurFade delay={0.7}>
            <div className="flex flex-col items-center gap-6">
              <Button
                size="lg"
                variant="primary"
                className="dark h-14 rounded-full uppercase shadow-md transition-all hover:shadow-lg"
                asChild
              >
                <Link href="/onboarding">
                  <ShoppingCartSimple className="size-6" />
                  Empieza ya!
                </Link>
              </Button>

              <Button asChild variant="iOSGhost" size="lg" className="rounded-full">
                <Link href="#how-it-works">
                  O descubre como funciona
                  <ArrowDown className="size-5" />
                </Link>
              </Button>
            </div>
          </BlurFade>
        </article>

        <BlurFade delay={0.7} className="absolute inset-x-4 bottom-8 z-10 w-full">
          <p className="text-center text-xs text-muted-foreground">
            <sup>1</sup> La oferta incluye una tarjeta NFC personalizable a través de la plataforma
            ConCard. El ENVÍO ES GRATIS a todo Lima (Perú); para provincias es necesario un abono
            adicional de S/. 17.90 PEN. Para envíos internacionales, por favor contáctenos para
            obtener la mejor cotización.
          </p>
        </BlurFade>
      </section>

      <div className="flex items-center bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 p-4 py-20 text-neutral-200">
        <section
          id="how-it-works"
          className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 text-center md:gap-14"
        >
          <header className="space-y-2 px-4 md:px-6">
            <p className="font-medium text-violet-400">{t("stepByStep.title")}</p>
            <h2 className="text-4xl font-semibold tracking-tight">{t("stepByStep.subtitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("stepByStep.subheading")}</p>
          </header>

          <div className="grid grid-cols-1 *:space-y-3 *:border-b *:border-border/20 *:px-4 *:py-6 md:grid-cols-2 md:justify-items-stretch md:gap-0 md:*:space-y-5 md:*:border-r md:*:px-8 md:*:py-10">
            <article className="border-b">
              <Badge variant="secondary">1</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepOneTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepOneDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="!border-r-0 border-b">
              <Badge variant="secondary">2</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepTwoTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepTwoDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="border-b">
              <Badge variant="secondary">3</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepThreeTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepThreeDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="!border-r-0 border-b">
              <Badge variant="secondary">4</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepFourTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepFourDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="border-none md:col-span-2">
              <Badge variant="secondary">5</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepFiveTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepFiveDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
