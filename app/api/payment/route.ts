import { getServerSession } from "@/lib/get-server-session";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/generated/prisma/client";
import { stripeClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeCustomerId = (user as User).stripeCustomerId;

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer found" },
      { status: 400 },
    );
  }

  const checkoutSession = await stripeClient.checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    currency: "inr",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "inr",
          unit_amount: 19900,
          product_data: {
            name: "Life Time Access",
            description: "Lifetime access to the premium feature",
          },
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
