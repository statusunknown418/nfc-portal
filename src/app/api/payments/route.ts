import crypto from "crypto";
import { eq } from "drizzle-orm";
import { Payment } from "mercadopago";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { PurchaseConfirmationEmail } from "~/lib/emails/PurchaseConfirmation";
import { payments } from "~/lib/payments";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";
import { db } from "~/server/db";
import { purchases, users } from "~/server/db/schema";
import { resend } from "~/server/resend";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as { data: { id: string } };
  const payment = await new Payment(payments).get({ id: body.data.id });
  const metadata = payment.metadata as {
    app_user_id: string;
    shipping_address: string;
    card_variant: "basic" | "custom" | "metallic";
    user_email: string;
  } & SaveNFCPreferences;

  if (!metadata.app_user_id) {
    return NextResponse.json({ listened: true, success: false, error: "UNAUTHORIZED" });
  }

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    return NextResponse.json({ listened: true, success: false, error: "MISSING_HEADERS" });
  }

  const [ts, v1] = xSignature.split(",");

  const timeStamp = ts?.replace("ts=", "").trim();
  const hash = v1?.replace("v1=", "").trim();

  const manifest = `id:${body.data.id};request-id:${xRequestId};ts:${timeStamp};`;

  const sha = crypto
    .createHmac("sha256", env.MERCADOPAGO_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  if (sha !== hash) {
    return NextResponse.json({ listened: true, success: false, error: "SIGNATURE_MISMATCH" });
  }

  await db
    .insert(purchases)
    .values({
      paymentId: payment.id,
      amount: payment.transaction_amount ?? 0,
      currency: payment.currency_id ?? "PEN",
      status: payment.status,
      userId: metadata.app_user_id,
      metadata,
    })
    .onConflictDoUpdate({
      set: {
        amount: payment.transaction_amount ?? 0,
        currency: payment.currency_id ?? "PEN",
        status: payment.status,
        metadata,
      },
      target: purchases.paymentId,
    });

  if (payment.status !== "approved") {
    return NextResponse.json({ listened: true, success: false, error: "PAYMENT_NOT_APPROVED" });
  }

  try {
    await resend.emails.send({
      to: metadata.user_email,
      from: "Purchases | NFC Portal <no-reply@concard.app>",
      subject: "Your NFC card was successfully purchased! 🎉",
      html: "Thanks for your purchase! Your card will be delivered as soon as possible.",
      react: PurchaseConfirmationEmail({
        email: metadata.user_email,
        cardVariant: metadata.card_variant,
        shippingAddress: metadata.shipping_address,
      }),
    });
  } catch (err) {
    await resend.emails.send({
      to: "help@stackkstudios.com",
      from: "NFC Portal <no-reply@concard.app>",
      subject: "NFC Portal - Error",
      text: `Error on payments for ${metadata.user_email} -> ${metadata.app_user_id}`,
      html: `Error on payments for ${metadata.user_email} -> ${metadata.app_user_id}`,
    });
  }

  await db
    .update(users)
    .set({
      hasPurchasedCard: true,
      hasCompletedOnboarding: true,
      hasPageActive: true,
      onboardingStep: "finale",
      cardShippingStatus: "in_progress",
      cardVariant: metadata.card_variant,
    })
    .where(eq(users.id, metadata.app_user_id));

  return NextResponse.json({ listened: true, success: true, error: null }, { status: 200 });
};
