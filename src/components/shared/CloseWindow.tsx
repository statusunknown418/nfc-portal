"use client";

import { Button } from "../ui/button";

export const CloseWindow = () => {
  return (
    <Button
      variant="outline"
      className="mt-1 rounded-full"
      onClick={() => window.close()}
    >
      Close this window (it&apos;s okay!)
    </Button>
  );
};
