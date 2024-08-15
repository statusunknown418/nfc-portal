import { toast } from "sonner";

export const setDecidedUsername = async (username: string) => {
  try {
    await fetch("/api/exposed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: username,
        key: COOKIES_KEYS.decidedUsername,
        type: "write",
      }),
    });
  } catch (e) {
    toast.error("Failed to set username");
  }
};

export const setAvailableLinkPosition = async (position: number) => {
  try {
    await fetch("/api/exposed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        /** Adding 1 so the DND works correctly */
        data: position + 1,
        key: COOKIES_KEYS.lastPosition,
        type: "write",
      }),
    });
  } catch (e) {
    toast.error("Failed to set last position");
  }
};

export const getAvailableLinkPosition = async () => {
  return (await fetch("/api/exposed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: COOKIES_KEYS.lastPosition,
      type: "read",
    }),
  }).then((res) => res.json())) as Promise<{ success: boolean; data: string }>;
};

export const COOKIES_KEYS = {
  decidedUsername: "decided-username",
  lastPosition: "last-position",
} as const;
