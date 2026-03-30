import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import Stripe from "stripe";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,

      onEvent: async (event) => {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.mode !== "payment") return;

          const customerId = session.customer as string;
          const amountPaid = session.amount_total; // in paise (19900 = ₹199)

          console.log(
            `✅ One-time payment received: ₹${amountPaid! / 100} from customer ${customerId}`,
          );

          // await db.user.update({
          //   where: { stripeCustomerId: customerId },
          //   data: { hasPaidAccess: true },
          // });
        }
      },
    }),
  ],
});
