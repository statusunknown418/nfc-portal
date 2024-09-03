"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export const ToggleContactVisibility = ({ defaultValues }: { defaultValues: boolean }) => {
  const [isChecked, setIsChecked] = useState(defaultValues);

  const utils = api.useUtils();
  const { mutateAsync } = api.vCard.toggleVisibility.useMutation({
    onSuccess: () => utils.vCard.get.invalidate(),
  });

  const handleToggle = () => {
    setIsChecked((prev) => !prev);

    toast.promise(mutateAsync({ hide: !isChecked }), {
      loading: "Saving...",
      success: `Contact visibility ${!isChecked ? "enabled" : "disabled"}`,
      error: "Something went wrong",
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed p-4",
        isChecked && "border-emerald-600 bg-emerald-50/50",
      )}
    >
      <Label className="flex items-center gap-4">
        <Switch defaultChecked={isChecked} onCheckedChange={handleToggle} />
        Enable contact information visibility
      </Label>
    </div>
  );
};
