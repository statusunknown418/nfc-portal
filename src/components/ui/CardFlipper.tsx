"use client";

import { useState } from "react";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import DotPattern from "~/components/magicui/dot-pattern";
import { cn } from "~/lib/utils";
import { PurchaseCardModal } from "src/components/admin/PurchaseCard";
import { Badge } from "src/components/ui/badge";
import { Button } from "../ui/button";

export default function CardFlipper() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="relative mt-4 flex min-h-full w-full items-start justify-center rounded-lg lg:mt-0">
      <CardContainer className="min-h-full w-full" containerClassName={cn("h-full w-full z-10")}>
        <CardBody
          className={`group/card flex w-full items-start justify-center ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transition: "transform 3.6s",
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {isFlipped ? (
            <CardItem
              translateZ="100"
              rotateX={15}
              rotateZ={5}
              className="flex h-[220px] w-[380px] flex-col justify-between rounded-xl bg-secondary p-6 text-sm text-secondary-foreground shadow-md shadow-black/50 group-hover:shadow-xl md:h-64"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex justify-between">
                <p className="font-medium text-muted-foreground">Reverse Side</p>
              </div>
              <div className="flex justify-between">
                <p>Your Logo</p>
                <p>Guacamole</p>
              </div>
            </CardItem>
          ) : (
            <CardItem
              translateZ="100"
              rotateX={15}
              rotateZ={5}
              className="flex h-[220px] w-[380px] flex-col justify-between rounded-xl bg-primary p-6 text-sm text-primary-foreground shadow-md shadow-black/50 group-hover:shadow-xl md:h-64"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex justify-between">
                <p className="font-medium text-muted-foreground">NearU</p>
                <p className="text-muted-foreground">#0000001</p>
              </div>
              <div className="flex justify-between">
                <p>Alvaro @status.unknown418</p>
                <p>stackkstudios.com</p>
              </div>
            </CardItem>
          )}
        </CardBody>
      </CardContainer>

      <section className="absolute bottom-1/4 z-10 flex w-full flex-col items-center justify-center gap-4">
        <Badge>Not purchased yet</Badge>

        <PurchaseCardModal />
      </section>

      <DotPattern className={cn("absolute left-0 top-0 z-0 h-full w-full opacity-70")} />

      <Button
        onClick={handleFlip}
        variant="outline"
        className="absolute top-[160px] z-10 rounded-full"
      >
        {isFlipped ? "Show Front" : "Show Back"}
      </Button>
    </div>
  );
}
