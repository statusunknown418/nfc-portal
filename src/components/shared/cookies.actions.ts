import { toast } from "sonner";

export const setDecidedUsername = async (username: string) => {
  try {
    await fetch("/api/exposed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
  } catch (e) {
    toast.error("Failed to set username");
  }
};
