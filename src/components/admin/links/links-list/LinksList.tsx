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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "~/components/shared/EmptyState";
import { Divider } from "~/components/ui/separator";
import { positionsStore } from "~/lib/stores/positions";
import { arrayMove, cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { SortableItem } from "../../SortableItem";
import { LinkItem } from "../LinkItem";
import { SocialLinkItem } from "../SocialLinkItem";

export const LinksSortableList = ({
  initialData,
  username,
}: {
  initialData?: RouterOutputs["links"]["all"];
  username: string;
}) => {
  const { data: cacheData } = api.links.all.useQuery(undefined, {
    initialData,
  });

  const updatePositionViaStore = positionsStore((s) => s.setPosition);

  const [allLinks, pragmaticUpdate] = useState(cacheData ?? []);
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
    onMutate: async (vars) => {
      const prevData = utils.links.all.getData();

      updatePositionViaStore(vars.id, vars.newPosition);

      return { prevData };
    },
    onSuccess: async () => {
      await Promise.all([
        utils.portals.get.invalidate({ username: username }),
        utils.viewer.previewPortal.invalidate(),
        utils.links.all.invalidate(),
      ]);
    },
    onError: (_input, _data, context) => {
      utils.links.all.setData(undefined, context?.prevData);
      toast.error("Failed to reorder links");
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

  useEffect(() => {
    if (cacheData) {
      /** Used to set the positions in the store, this is way faster than using react-query's `setData()` */
      cacheData.map((item) => updatePositionViaStore(item.id, item.position));
      pragmaticUpdate(cacheData);
    }
  }, [cacheData, updatePositionViaStore]);

  if (!allLinks.length) {
    return <EmptyState />;
  }

  return (
    <>
      <Divider>Social links</Divider>

      <DndContext
        id="links-sortable-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          id="social-links-sortable-list"
          items={allLinks.filter((item) => !!item.socialType).map((item) => item.id)}
        >
          <div className="flex w-full flex-wrap gap-4">
            {allLinks
              .filter((item) => !!item.socialType)
              .map((item) => (
                <SortableItem key={item.id} id={item.id} className="w-max">
                  {({ attributes, listeners }) => (
                    <SocialLinkItem
                      data={item}
                      username={username}
                      key={item.id}
                      attributes={attributes}
                      listeners={listeners}
                      aria-describedby={`social-link-handle-${item.id}-describedby`}
                    />
                  )}
                </SortableItem>
              ))}
          </div>
        </SortableContext>
      </DndContext>

      <Divider>Other links</Divider>

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
          items={allLinks.filter((item) => !item.socialType).map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {allLinks
            .filter((item) => !item.socialType)
            .map((item) => (
              <SortableItem key={item.id} id={item.id}>
                {({ active, attributes, listeners }) => (
                  <LinkItem
                    username={username}
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
          {/** We know the element will exist so using `!` is safe */}
          {activeIndex !== null && <LinkItem data={allLinks[activeIndex]!} username={username} />}
        </DragOverlay>
      </DndContext>
    </>
  );
};
