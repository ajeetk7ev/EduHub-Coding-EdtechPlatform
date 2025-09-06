import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env file");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
