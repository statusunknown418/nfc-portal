import { type WebhookEvent } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(req: Request) {
  const secret = env.CLERK_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = (await req.json()) as unknown;
  const body = JSON.stringify(payload);

  const wh = new Webhook(secret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Error occurred when verifying the payload", {
      status: 400,
    });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const {
      id: userId,
      image_url,
      username,
      primary_email_address_id,
      first_name,
      last_name,
      email_addresses,
    } = evt.data;

    const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id);

    if (!primaryEmail) {
      throw new Error("Primary email not found");
    }

    await db
      .insert(users)
      .values({
        id: userId,
        username,
        email: primaryEmail.email_address,
        image: image_url,
        name: `${first_name} ${last_name}`,
      })
      .onConflictDoUpdate({
        set: {
          image: image_url,
          name: `${first_name} ${last_name}`,
          email: primaryEmail.email_address,
          username,
        },
        target: users.id,
      });

    revalidatePath("/admin", "layout");
  }

  return new Response("Webhook received", {
    status: 200,
  });
}
