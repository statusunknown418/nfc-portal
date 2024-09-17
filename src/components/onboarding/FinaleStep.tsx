import { ArrowRightIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Confetti, { type ConfettiRef } from "../magicui/confetti";
import { Button } from "../ui/button";

export const FinaleStep = () => {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef?.current?.fire({});
  }, []);

  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = async () => {
      if (Date.now() > end) return;

      await Promise.all([
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        }),
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        }),
      ]);

      requestAnimationFrame(() => void frame());
    };

    void frame();
  };

  return (
    <section className="relative mx-auto flex h-full flex-col items-center justify-center gap-4">
      <CheckCircledIcon className="h-10 w-10 text-emerald-600 md:h-12 md:w-12" />

      <h2 className="text-2xl font-bold tracking-wide md:text-4xl">You are all done!</h2>

      <p className="max-w-prose text-center">
        Your purchase means a lot to us. Your support is heavily appreciated and will help us build
        a better product for our customers!.
        <br />
        <br />
        <br />
        <span className="text-muted-foreground">
          You will receive a confirmation email shortly. If nothing arrives try checking your spam
          folder or contact us directly we&apos;re happy to help.
        </span>
      </p>

      <Button onClick={handleClick} className="z-10" size="sm" variant="outline">
        ✨ Click me for fun
      </Button>

      <Button size="lg" variant="primary" className="z-10 mt-4 rounded-full" asChild>
        <Link href="/admin">
          Go to admin panel <ArrowRightIcon />
        </Link>
      </Button>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
        onMouseEnter={() => confettiRef.current?.fire({})}
      />
    </section>
  );
};
