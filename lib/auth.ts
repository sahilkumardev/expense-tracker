import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import Stripe from "stripe";
import { nextCookies } from "better-auth/next-js";

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
  user: {
    additionalFields: {
      isPro: {
        type: "boolean",
        default: false,
      },
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

          // const amountPaid = session.amount_total;
          // console.log(
          //   `✅ One-time payment received: ₹${amountPaid! / 100} from customer ${customerId}`,
          // );

          const updated = await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { isPro: true },
          });

          if (updated.count > 0) {
            console.log(`✅ isPro set to true for customer: ${customerId}`);
          } else {
            console.warn(
              `⚠️ No user found with stripeCustomerId: ${customerId}`,
            );
          }
        }
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
