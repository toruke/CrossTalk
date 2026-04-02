import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "ELEVE",
      },
      nom: {
        type: "string",
        required: true,
      },
      prenom: {
        type: "string",
        required: true,
      },
      telephone: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  rateLimit: {
    window: 60,
    max: 100,
  },
});

export type Session = typeof auth.$Infer.Session;
