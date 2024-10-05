import { ClerkLoading, SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  LightningBoltIcon,
  LockClosedIcon,
  MagicWandIcon,
  OpenInNewWindowIcon,
  QuestionMarkCircledIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import AnimatedGridPattern from "~/components/magicui/animated-grid-pattern";
import BlurFade from "~/components/magicui/blur-fade";
import { BorderBeam } from "~/components/magicui/border-beam";
import HyperText from "~/components/magicui/hyper-text";
import Marquee from "~/components/magicui/marquee";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { HydrateClient } from "~/trpc/server";

const reviews = [
  {
    name: "@ju.pa****",
    username: "Ingeniero Biomédico",
    body: "Incluso siendo estudiante, esto ha mejorado mi acceso a mejores oportunidades laborales.",
    img: "https://avatar.vercel.sh/jose?text=jose.h",
  },
  {
    name: "@rw.****",
    username: "Ingeniero Mecánico",
    body: "Esto ha mejorado mucho mi perfil profesional. ¡Lo recomiendo totalmente!",
    img: "https://avatar.vercel.sh/rodrigo?text=ra",
  },
  {
    name: "@jos****",
    username: "Ingeniero de Producto en AV****",
    body: "Esta es la mejor solución para mejorar el networking.",
    img: "https://avatar.vercel.sh/joseph?text=jm",
  },
  {
    name: "@bdi****",
    username: "CEO en CI** Perú",
    body: "¡Compartir mi contacto con nuevas personas nunca ha sido tan fácil!",
    img: "https://avatar.vercel.sh/jill?text=boris.d",
  },
  {
    name: "@mar****",
    username: "Líder de Marketing en PEP****",
    body: "Me faltan las palabras. Esto es increíble. Me encanta.",
    img: "https://avatar.vercel.sh/john?text=martina.m",
  },
  {
    name: "@ari.****",
    username: "Abogado en M****",
    body: "Este producto puede realmente cambiar la forma en que nos comunicamos.",
    img: "https://avatar.vercel.sh/jane?text=JO",
  },
  {
    name: "@kim****",
    username: "Ingeniera de Software en NT****",
    body: "He estado usando este producto durante semanas y ha sido un cambio radical.",
    img: "https://avatar.vercel.sh/kimberly?text=kimberly.c",
  },
  {
    name: "@fr.****",
    username: "Investigador en Física en PU**",
    body: "Mejorar nuestra marca personal definitivamente abre muchas puertas.",
    img: "https://avatar.vercel.sh/francisco?text=FD",
  },
  {
    name: "@the.ar****",
    username: "CEO en Sta****",
    body: "¡Simple, fácil y efectivo para destacar!",
    img: "https://avatar.vercel.sh/john?text=TA",
  },
  {
    name: "@j.a.****",
    username: "Ingeniero Civil en V**",
    body: "Usar ConCard en eventos sociales te hace destacar entre la multitud.",
    img: "https://avatar.vercel.sh/john?text=JA",
  },
  {
    name: "@er.d.****",
    username: "Médico en Hosp**** *****",
    body: "Solía pensar que el networking no era para mí, ¡pero ConCard cambió eso!",
    img: "https://avatar.vercel.sh/john?text=JA",
  },
  {
    name: "@sej.****",
    username: "Gerente de Marketing en Via**** ****",
    body: "¡Llevábamos años necesitando algo como esto, y por fin está aquí!",
    img: "https://avatar.vercel.sh/john?text=JL",
  },
  {
    name: "@diego.****",
    username: "Ingeniero Biomédico en Cl**** *****",
    body: "Siempre me ha encantado el networking, ¡pero esto es definitivamente mejor!",
    img: "https://avatar.vercel.sh/john?text=DR",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

export default async function Home() {
  const { sessionClaims } = auth();

  return (
    <HydrateClient>
      <main className="relative flex flex-col items-stretch gap-10">
        <div className="sticky inset-0 z-10 flex h-16 w-full items-end justify-center px-2">
          <header className="flex h-12 w-full max-w-7xl items-center justify-between rounded-full border border-border/50 bg-white px-2 py-2 backdrop-blur-lg backdrop-filter">
            <Link href={"/"}>
              <p>Logo</p>
            </Link>

            <ul className="hidden md:flex">
              <Button asChild variant="ghost">
                <Link href={"/#features"}>Features</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href={"/#customers"}>Customers</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href={"#pricing"}>Pricing</Link>
              </Button>
            </ul>

            {!sessionClaims?.username && (
              <ClerkLoading>
                <Skeleton className="h-9 w-28" />
              </ClerkLoading>
            )}

            <SignedIn>
              <Button asChild className="rounded-full">
                <Link href="/admin">
                  Dashboard <ChevronRightIcon />
                </Link>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignUpButton>
                <Button className="rounded-full">
                  Join now <ArrowRightIcon />
                </Button>
              </SignUpButton>
            </SignedOut>
          </header>
        </div>

        <AnimatedGridPattern
          duration={2}
          repeatDelay={0.5}
          numSquares={50}
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "absolute inset-0 -z-10 h-svh w-svw fill-indigo-500 opacity-30",
          )}
        />

        <div
          id="hero"
          className="relative flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-16"
        >
          <section className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
            <article className="flex flex-col items-center gap-7">
              <BlurFade delay={0.25 * 2}>
                <Badge>
                  ✨ Introducing premium cards <ArrowRightIcon />
                </Badge>
              </BlurFade>

              <BlurFade>
                <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  Descubre la nueva era profesional, gracias a la tecnologia{" "}
                  <span className="bg-gradient-to-r from-indigo-700 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                    NFC
                  </span>{" "}
                </h1>
              </BlurFade>

              <BlurFade delay={0.25}>
                <p className="max-w-sm text-pretty text-center text-muted-foreground sm:text-lg md:max-w-lg md:text-xl lg:max-w-4xl">
                  Potencia tu experiencia y destaca frente a la competencia con nuestras tarjetas de
                  presentación premium. Solo acércala al teléfono de alguien y comparte tu página
                  personal personalizada!
                </p>
              </BlurFade>

              <BlurFade delay={0.25}>
                <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                  <SignUpButton>
                    <Button
                      asChild
                      variant="primary"
                      size="lg"
                      className="group w-full shadow-lg shadow-indigo-300 transition-all hover:shadow-xl hover:shadow-indigo-300 sm:w-auto"
                    >
                      <Link href="/admin">
                        Comienza Ahora
                        <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </SignUpButton>

                  <Button asChild variant="ghost" size="lg" className="group">
                    <Link href="#features">
                      Porque ConCard?
                      <QuestionMarkCircledIcon className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </BlurFade>
            </article>
          </section>

          <article className="w-full max-w-7xl px-4">
            <BlurFade delay={0.25 * 2}>
              <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border/50 bg-white shadow-lg shadow-[hsl(240_37%_90%)]">
                Video or card animation
              </div>
            </BlurFade>
          </article>

          <Button variant="ghost">
            <ArrowDownIcon />
            Learn more
          </Button>
        </div>

        <section className="bg-white py-24" id="customers">
          <article className="relative mx-auto max-w-7xl">
            <h3 className="text-center text-lg font-medium uppercase text-muted-foreground">
              Con la confianza de profesionales en todas las industrias
            </h3>

            <Marquee pauseOnHover className="mt-5 [--duration:30s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>

            <Marquee reverse pauseOnHover className="[--duration:30s]">
              {secondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background" />

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Ocultamos los nombres completos e informacion personal por razones de privacidad
            </p>
          </article>
        </section>

        <section
          id="features"
          className="flex items-center justify-center px-4 py-10 md:px-10 md:pb-20"
        >
          <article className="w-full max-w-7xl space-y-8 rounded-[32px]">
            <div className="space-y-2">
              <p className="font-semibold text-indigo-600">Caracteristicas</p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Beneficios, y porque escogernos?
              </h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                Explora los beneficios de usar nuestro producto y porque somos la mejor opcion para
                ti
              </p>
            </div>

            <section className="grid min-h-[800px] grid-cols-1 gap-4 *:flex *:flex-col *:gap-6 *:rounded-[24px] *:p-6 lg:grid-cols-12 lg:grid-rows-4">
              <article className="group border border-indigo-300 bg-indigo-100 text-indigo-900 lg:col-span-8 lg:row-span-2">
                <div>graphic 1</div>

                <h2 className="text-2xl font-medium">
                  <span className="transition-all group-hover:text-indigo-400">
                    Extremadamente facil de usar,
                  </span>{" "}
                  <span className="text-indigo-400 transition-all group-hover:text-inherit">
                    comienza en solo unos minutos
                  </span>{" "}
                  <span className="transition-all group-hover:text-indigo-400">
                    y destaca frente a la competencia{" "}
                  </span>
                  <span className="text-indigo-400 transition-all group-hover:text-inherit">
                    mostrando tu perfil de manera única y profesional.
                  </span>{" "}
                  <span>¡Comparte tu URL de ConCard en cualquier lugar!</span>
                </h2>
              </article>

              <article className="border border-pink-300 bg-pink-100 text-pink-900 lg:col-span-4 lg:row-span-2">
                <section className="group relative flex h-48">
                  <div className="absolute right-5 top-0 h-36 w-64 rounded-lg border bg-white transition-all" />
                  <div className="absolute right-14 top-4 h-36 w-64 rounded-lg border bg-gradient-to-r from-neutral-600 via-muted to-neutral-600 transition-all" />
                  <div className="absolute right-28 top-8 flex h-36 w-64 flex-col items-center justify-center gap-3 rounded-lg border bg-primary text-primary-foreground transition-all group-hover:scale-105">
                    <p className="flex items-center gap-2">
                      <Share1Icon className="h-5 w-5" /> Johannes Doe
                    </p>

                    <p className="text-sm text-muted-foreground">CEO at ACME</p>
                  </div>
                </section>

                <h2 className="text-2xl font-medium">
                  Altamente personalizable,{" "}
                  <span className="text-pink-500">ofrecemos una amplia gama de opciones</span> para
                  que tu portal y tarjeta de presentacion sean verdaderamente{" "}
                  <span className="text-pink-500">tuyos y unicos</span>
                </h2>
              </article>

              <article className="border border-emerald-300 bg-emerald-100 text-emerald-900 lg:col-span-4 lg:row-span-2">
                <div>graphic 3</div>

                <h2 className="text-2xl font-medium">
                  No se requieren aplicaciones externas,{" "}
                  <span className="text-emerald-500">funciona de inmediato</span> en todos los
                  dispositivos iOS y{" "}
                  <span className="text-emerald-500"> en la mayoría de los teléfonos Android</span>
                </h2>
              </article>

              <article className="border border-neutral-50 bg-primary text-neutral-50 lg:col-span-8 lg:row-span-2">
                <div>
                  <LockClosedIcon className="size-6" />
                  <HyperText text="Toda tu informacion esta encriptada" />
                </div>

                <h2 className="text-2xl font-medium">
                  Informacion segura,{" "}
                  <span className="text-muted-foreground">
                    nadie puede ver tu contacto personal a menos
                  </span>{" "}
                  <span>que lo compartas explícitamente</span>{" "}
                  <span className="text-muted-foreground">
                    acercando una de tus tarjetas de presentación.
                  </span>
                </h2>
              </article>
            </section>
          </article>
        </section>

        <section
          id="comparison"
          className="-mb-10 flex items-center justify-center rounded-t-[24px] bg-white px-4 py-24 md:min-h-[1000px] md:px-10"
        >
          <article className="group w-full max-w-7xl space-y-10 rounded-[32px]">
            <section className="space-y-2">
              <p className="font-medium text-blue-600">Comparalo tu mismo</p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Antes vs{" "}
                <span className="bg-gradient-to-r from-violet-700 to-purple-400 bg-clip-text text-transparent">
                  Despues
                </span>
              </h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                La forma tradicional de compartir tu información es entregando una tarjeta de
                presentación o escribiendo tus datos en un papel. Pero, ¿y si pudieras compartir tu
                contacto de manera instantánea y sin complicaciones, sin tener que recurrir al
                papel?
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2 md:gap-10">
              <Card className="rounded-[28px] border-dashed bg-zinc-100 p-3 shadow-none transition-all duration-300 group-hover:translate-x-1/2 group-hover:scale-95 group-hover:blur-sm md:p-6">
                <CardHeader>
                  <CardTitle className="text-xl">Otros</CardTitle>
                  <CardDescription className="text-base">
                    El modo usual, nada especial
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="list-disc space-y-3 pl-4 text-lg font-light text-muted-foreground">
                    <li>Enlace simple en la biografía (no siempre disponible)</li>
                    <li>Lo más probable es que requiera una aplicación</li>
                    <li>No es útil para destacar</li>
                    <li>Las tarjetas impresas tradicionales pueden dañar el medio ambiente</li>
                    <li>
                      Funciona... pero es <span className="font-medium italic">aburrido</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative rounded-[28px] border border-indigo-400 bg-primary p-3 text-primary-foreground shadow-xl shadow-violet-300 transition-all duration-300 group-hover:-translate-x-[calc(50%+2.5rem)] group-hover:translate-y-10 group-hover:scale-110 md:p-6">
                <CardHeader>
                  <CardTitle className="text-2xl">ConCard</CardTitle>
                  <CardDescription className="text-base">
                    Mejora tu perfil profesional
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 text-lg font-light text-zinc-200">
                    <li className="flex gap-3">
                      <Badge variant="violet">1</Badge>
                      <p>Tarjeta de presentación NFC personalizable ✨</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">2</Badge>
                      <p>Crea tu propia página personal pública</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">3</Badge>
                      <p>Añade todos los enlaces que quieras compartir</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">4</Badge>
                      <p>Información segura</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">5</Badge>
                      <p>No necesitas instalar nada</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">6</Badge>
                      <p>Mejora y muestra tu marca</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">7</Badge>
                      <p>¡Compra una... o muchas!</p>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="text-muted-foreground">
                  <p className="text-sm">Como un LinkTree, pero mucho mejor!</p>
                </CardFooter>

                <BorderBeam size={100} duration={10} delay={5} borderWidth={2} />
              </Card>
            </section>
          </article>
        </section>

        <div className="flex min-h-screen items-center rounded-t-[24px] bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 p-4 py-20 text-neutral-200">
          <section
            id="how-it-works"
            className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:gap-14"
          >
            <header className="space-y-2 px-4 md:px-6">
              <p className="font-medium text-emerald-400">Paso a Paso</p>
              <h2 className="text-4xl font-semibold tracking-tight">Y como funciona?</h2>
              <p className="text-lg text-muted-foreground">
                Combinamos tecnologias de primera para que nuestro producto tenga la calidad que
                buscas
              </p>
            </header>

            <div className="grid grid-cols-1 *:space-y-3 *:border-b *:border-border/20 *:px-4 *:py-6 md:grid-cols-2 md:justify-items-stretch md:gap-0 md:*:space-y-5 md:*:border-r md:*:px-8 md:*:py-10">
              <article className="border-b">
                <Badge variant="secondary">1</Badge>

                <section>
                  <h3 className="text-lg font-medium">Registrate y elige tu nombre de usuario</h3>
                  <p className="text-muted-foreground">
                    Puedes usar un correo electrónico o una cuenta de redes sociales para
                    registrarte
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="!border-r-0 border-b">
                <Badge variant="secondary">2</Badge>

                <section>
                  <h3 className="text-lg font-medium">Agrega tu información de contacto</h3>
                  <p className="text-muted-foreground">
                    Cualquier cosa que quieras compartir con tus contactos.
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="border-b">
                <Badge variant="secondary">3</Badge>

                <section>
                  <h3 className="text-lg font-medium">Personaliza tu página</h3>
                  <p className="text-muted-foreground">
                    Puedes agregar tu propio contenido y personalizar tu página.
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="!border-r-0 border-b">
                <Badge variant="secondary">4</Badge>

                <section>
                  <h3 className="text-lg font-medium">Personaliza tu tarjeta</h3>
                  <p className="text-muted-foreground">
                    Elige entre una variedad de opciones o crea tu propio diseño
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="border-none md:col-span-2">
                <Badge variant="secondary">5</Badge>

                <section>
                  <h3 className="text-lg font-medium">Ya estas listo!</h3>
                  <p className="max-w-prose text-muted-foreground">
                    No necesitas instalar nada, simplemente acércala al teléfono de alguien y
                    comparte tu página, ¡incluida tu información de contacto!
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>
            </div>
          </section>
        </div>

        <section
          id="pricing"
          className="-mt-10 flex items-center justify-center bg-white bg-gradient-to-t px-4 py-10 md:min-h-[950px] md:px-10 md:pb-20"
        >
          <article className="w-full max-w-7xl space-y-14 rounded-[32px]">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <p className="font-semibold text-indigo-600">Precio</p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Precios claros y sencillos, sin costos ocultos
              </h2>
              <p className="text-lg text-muted-foreground">
                Ofrecemos un único plan para todos nuestros clientes individuales, para que puedas
                enfocarte en lo que más importa.
              </p>
            </div>

            <section className="group grid grid-cols-1 place-items-center gap-4 md:grid-cols-3">
              <Card className="hidden h-full translate-x-14 translate-y-10 rounded-[24px] border-dashed bg-zinc-50 p-4 shadow-none blur-sm transition-all duration-300 group-hover:translate-x-24 group-hover:-rotate-12 group-hover:scale-90 group-hover:blur-md md:block">
                <CardHeader>
                  <CardTitle className="text-xl">Some plan</CardTitle>
                  <CardDescription className="text-base">
                    Many brands usually offer way too many options, so we decided to keep it simple
                    and only offer a single plan
                  </CardDescription>
                </CardHeader>

                <CardContent className="list-inside space-y-4 text-lg font-light text-muted-foreground">
                  <li className="flex gap-2">
                    <Badge variant="outline">1</Badge>
                    <p>The landing page is nice, innit?</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">2</Badge>
                    <p>Something that is not included</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">3</Badge>
                    <p>You should read this</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">4</Badge>
                    <p>Just placeholder text</p>
                  </li>

                  <li className="flex gap-2">
                    <Badge variant="outline">5</Badge>
                    <p>More unused text</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">6</Badge>
                    <p>Something that is not included</p>
                  </li>
                </CardContent>
              </Card>

              <Card className="relative z-10 h-full w-full rounded-[24px] border border-indigo-400 bg-gradient-to-br from-primary to-indigo-950 text-primary-foreground shadow-xl shadow-indigo-400 transition-all duration-300 group-hover:translate-y-5 group-hover:scale-105 md:p-4">
                <CardHeader>
                  <p className="text-muted-foreground">Empezando desde</p>
                  <CardTitle className="text-2xl font-normal text-green-400">
                    S/. 49.90 PEN
                  </CardTitle>
                  <CardTitle className="text-2xl">Profesional</CardTitle>
                  <CardDescription className="text-base">
                    Un único plan asequible y flexible, perfecto para todos. Incluye:
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-4 font-light text-zinc-200 md:text-lg">
                    <li className="flex gap-3">
                      <Badge variant="secondary">1</Badge>
                      <p>1 business card included</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">2</Badge>
                      <p>Envio gratuito! (Lima)</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">3</Badge>
                      <p>Todas las opciones de personalización de la página</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">4</Badge>
                      <p>Enlaces sociales/profesionales </p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">5</Badge>
                      <p>Alta seguridad para tu información</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">6</Badge>
                      <p>Firmas de correo electrónicos</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">7</Badge>
                      <p>¡Y más!</p>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter>
                  <SignUpButton>
                    <Button variant="primary" className="w-full" size="lg">
                      <MagicWandIcon className="h-5 w-5" />
                      Empieza ahora!
                    </Button>
                  </SignUpButton>
                </CardFooter>

                <BorderBeam size={100} duration={10} delay={5} borderWidth={2} />
              </Card>

              <Card className="hidden h-full -translate-x-14 translate-y-10 rounded-[24px] border-dashed bg-zinc-50 p-4 shadow-none blur-sm transition-all duration-300 group-hover:-translate-x-24 group-hover:rotate-12 group-hover:scale-90 group-hover:blur-md md:block">
                <CardHeader>
                  <CardTitle className="text-xl">Another plan</CardTitle>
                  <CardDescription className="text-base">
                    Some other plan not offered by us that is more expensive without much additional
                    benefits
                  </CardDescription>
                </CardHeader>

                <CardContent className="list-inside space-y-4 text-lg font-light text-muted-foreground">
                  <li className="flex gap-2">
                    <Badge variant="outline">1</Badge>
                    <p>The landing page is nice, innit?</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">2</Badge>
                    <p>Something that is not included</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">3</Badge>
                    <p>You should read this</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">4</Badge>
                    <p>Just placeholder text</p>
                  </li>

                  <li className="flex gap-2">
                    <Badge variant="outline">5</Badge>
                    <p>More unused text</p>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline">6</Badge>
                    <p>Something that is not included</p>
                  </li>
                </CardContent>
              </Card>
            </section>
          </article>
        </section>

        <article className="p-10">
          <section id="security" className="mx-auto w-full max-w-7xl">
            <header className="space-y-2">
              <p className="font-medium text-pink-700">FAQ</p>
              <h2 className="text-4xl font-semibold tracking-tight">Alguna duda?</h2>
              <p className="text-muted-foreground">
                Si ninguna de estas respuestas resuelve tu duda, no dudes en contactarnos en{" "}
                <Link href="mailto:help@stackkstudios.com" className="text-primary underline">
                  help@stackkstudios.com
                </Link>
              </p>
            </header>

            <Accordion type="single" collapsible className="mt-8 w-full">
              <AccordionItem value="explain-nfc">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  Que es la tecnologia NFC?
                </AccordionTrigger>

                <AccordionContent className="text-lg font-light" accessKey="explain-nfc">
                  NFC significa Near Field Communication (Comunicación de Campo Cercano), una
                  tecnología que permite que dos dispositivos se comuniquen entre sí a corta
                  distancia, lo que también impulsa a Apple Pay y Google Pay. ConCard lo utiliza
                  para que puedas compartir cualquier información de contacto con otros, sin
                  necesidad de que instalen aplicaciones adicionales.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="purchases">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  Como compro una tarjeta?
                </AccordionTrigger>
                <AccordionContent className="text-lg font-light" accessKey="purchases">
                  Para comprar una tarjeta, simplemente{" "}
                  <SignUpButton>
                    <button className="font-medium underline underline-offset-2 hover:text-indigo-700">
                      empieza aqui
                    </button>
                  </SignUpButton>{" "}
                  y solo sigue los pasos de incorporación, es simple y directo, puedes completarlo
                  en menos de 10 minutos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compatibility">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  Que dispositivos son compatibles?
                </AccordionTrigger>

                <AccordionContent className="text-lg font-light" accessKey="how-it-works">
                  ConCard es compatible con todos los dispositivos iOS y la mayoría de los
                  dispositivos Android (es decir, desde 2020 en adelante). Si el dispositivo no es
                  compatible o tienes dudas, aún puedes compartir tu información de contacto y
                  enlaces escaneando el código QR.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-it-works">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  Como lo uso?
                </AccordionTrigger>
                <AccordionContent className="text-lg font-light" accessKey="how-it-works">
                  Puedes usar ConCard para compartir tu información de contacto con otros sin que
                  ellos necesiten instalar aplicaciones adicionales. Simplemente acércala al
                  teléfono de alguien y comparte tu página, ¡incluida tu información de contacto!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  Que pasa si alguien encuentra mi perfil por accidente?
                </AccordionTrigger>

                <AccordionContent className="text-lg font-light">
                  No te preocupes, tomamos tu privacidad muy en serio y hemos diseñado un sistema
                  para proteger tu información privada. Todas las páginas están encriptadas y solo
                  son accesibles cuando tú las abres explícitamente al acercar tu tarjeta al
                  teléfono de alguien.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </article>

        <footer className="mt-20 flex flex-col justify-end gap-10 rounded-t-[32px] bg-neutral-900 px-4 py-8 text-center text-neutral-400 shadow-xl md:px-10">
          <section className="flex w-full flex-wrap items-center justify-center gap-5">
            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="/admin">
                Get started
                <LightningBoltIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="mailto:help@stackkstudios.com">Contact</Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="/">About us</Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="/">Terms of service</Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="/">Privacy policy</Link>
            </Button>
          </section>

          <div className="flex items-center justify-center gap-2">
            <p>A project from</p>

            <Link
              target="_blank"
              className="flex items-center gap-2 underline-offset-2 transition-all hover:text-indigo-400 hover:underline"
              href={{
                pathname: "https://stackkstudios.com",
              }}
            >
              Stackk Studios <OpenInNewWindowIcon />
            </Link>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-72 cursor-pointer overflow-hidden rounded-3xl border p-6 transition-colors",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-indigo-50/50",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width={32} height={32} alt="avatar" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-xs font-medium">{name}</figcaption>
          <p className="text-sm dark:text-white/40">{username}</p>
        </div>
      </div>

      <blockquote className="mt-3 text-sm">{body}</blockquote>
    </figure>
  );
};
