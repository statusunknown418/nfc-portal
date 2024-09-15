"use client";

import DotPattern from "~/components/magicui/dot-pattern";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import { cn } from "~/lib/utils";

export const CardPreview = () => {
  return (
    <article className="relative mt-4 flex min-h-full w-full flex-col items-center justify-center rounded-lg lg:mt-0">
      <CardContainer
        className="min-h-full w-full flex-grow"
        containerClassName={cn("min-h-full flex-grow w-full z-10")}
      >
        <CardBody className="group/card flex w-full items-start justify-center">
          <CardItem
            translateZ="100"
            rotateX={15}
            rotateZ={5}
            className="flex h-[220px] w-[380px] flex-col justify-between rounded-xl bg-primary p-6 text-sm text-primary-foreground shadow-md shadow-black/50 group-hover:shadow-xl md:h-64"
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
        </CardBody>
      </CardContainer>

      <DotPattern
        className={cn("z-0 w-full p-1 opacity-70 [mask-image:linear-gradient(to_bottom)]")}
      />
    </article>
  );
};
