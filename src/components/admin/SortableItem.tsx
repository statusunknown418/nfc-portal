"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import { cn } from "~/lib/utils";

type UseSortableReturn = Omit<
  ReturnType<typeof useSortable>,
  "setNodeRef" | "transform" | "transition" | "isDragging"
>;

export function SortableItem(props: {
  id: number;
  children: (args: UseSortableReturn) => React.ReactNode;
}) {
  const { setNodeRef, transform, transition, isDragging, ...rest } = useSortable({
    id: props.id,
    transition: {
      duration: 500,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("w-full", isDragging && "z-50 rounded-xl")}>
      {props.children({ ...rest })}
    </div>
  );
}
