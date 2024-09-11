"use client";

import { useState } from "react";
import { Button } from "./button";
import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons";

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground" onClick={handleCopy}>
      {copied ? <CheckCircledIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
    </Button>
  );
};
