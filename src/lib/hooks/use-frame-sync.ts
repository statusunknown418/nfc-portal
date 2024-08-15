import { useEffect } from "react";

/**
 * @description use this to sync an iframe with its parent window without reloading the iframe and causing flicker
 * @param action any function to run when the message is received
 * @returns
 */
export const useFrameSync = <T extends { type: string }>(action: () => void) => {
  useEffect(() => {
    const handleMessageListener = (event: MessageEvent) => {
      const message = event.data as T;

      if (message.type === "reload") {
        void action();
      }
    };

    window.addEventListener("message", handleMessageListener);

    return () => {
      window.removeEventListener("message", handleMessageListener);
    };
  }, [action]);

  return;
};
