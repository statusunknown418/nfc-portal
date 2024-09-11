import { useEffect, useRef, useState } from "react";

/**
 * @description use this to sync an iframe with its parent window without reloading the iframe and causing flicker
 * @param action any function to run when the message is received
 * @returns
 */
export const useFrameSyncReceiver = <T extends { type: string; data: string }>(
  action: () => void,
  defaultValue?: string | Record<string, unknown>,
) => {
  const [value, setDefaultValue] = useState(defaultValue);

  useEffect(() => {
    const handleMessageListener = (event: MessageEvent) => {
      const message = event.data as T;

      if (message.type === "reload") {
        void action();
      }

      if (message.type === "update") {
        setDefaultValue(message);
      }
    };

    window.addEventListener("message", handleMessageListener);

    return () => {
      window.removeEventListener("message", handleMessageListener);
    };
  }, [action]);

  return value;
};

/**
 * Complementary to `useFrameSyncReceiver`, this hook is used to send a message FROM the parent window to the iframe
 * @param listenToKey any string that will be used to resend a message when updated
 * @returns ref to the iframe
 */
export const useFrameSyncSender = (
  listenToKey: string,
  message?: Record<string, unknown> | string,
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: "reload" });
      message && iframeRef.current.contentWindow?.postMessage({ type: "update", data: message });
    }
  }, [listenToKey, message]);

  return iframeRef;
};
