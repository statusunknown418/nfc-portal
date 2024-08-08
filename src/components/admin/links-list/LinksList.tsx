"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { arrayMove, cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { SortableItem } from "../SortableItem";
import { LinkItem } from "./LinkItem";

export const LinksSortableList = ({ data }: { data: RouterOutputs["links"]["all"] }) => {
  const { data: cacheData } = api.links.all.useQuery(undefined, {
    initialData: data,
  });

  const [allLinks, pragmaticUpdate] = useState(cacheData);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const utils = api.useUtils();
  const reorder = api.links.reorder.useMutation({
    onSuccess: async () => {
      await utils.links.all.refetch();
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }

    if (active.id === over.id) {
      return;
    }

    if (activeIndex !== null && overIndex !== null) {
      reorder.mutate({
        id: Number(active.id),
        newPosition: overIndex,
        prevPositionsIds: allLinks.map((item) => item.id),
      });

      pragmaticUpdate((prev) => {
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setActiveIndex(Number(event.active.data.current?.sortable?.index));
  };

  const handleDragOver = (event: DragOverEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setOverIndex(Number(event.over?.data.current?.sortable?.index));
  };

  return (
    <DndContext
      id="links-sortable-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        id="links-sortable-list"
        items={allLinks.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {allLinks.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {({ active, attributes, listeners }) => (
              <LinkItem
                key={item.id}
                data={item}
                className={cn("w-full", active?.id === item.id && "opacity-0")}
                attributes={attributes}
                listeners={listeners}
                aria-describedby={`link-handle-${item.id}-describedby`}
              />
            )}
          </SortableItem>
        ))}
      </SortableContext>

      <DragOverlay>
        {activeIndex !== null && (
          /** We know the element will exist so using `!` is safe */
          <LinkItem data={allLinks[activeIndex]!} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
