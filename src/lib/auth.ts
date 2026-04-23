import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import fs from "node:fs";
import path from "node:path";
import { db } from "./db";

const resetLogPath = path.join(process.cwd(), "data", "reset-links.log");

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      // No email provider wired yet — write the reset link to console + a
      // local log file so the dev / user can grab it and complete the flow.
      // Replace with a real email sender (Resend, Postmark, SendGrid, …).
      const line = `[${new Date().toISOString()}] reset for ${user.email} -> ${url}`;
      // eslint-disable-next-line no-console
      console.log("\n────────── PASSWORD RESET LINK ──────────");
      // eslint-disable-next-line no-console
      console.log(line);
      // eslint-disable-next-line no-console
      console.log("──────────────────────────────────────────\n");
      try {
        fs.appendFileSync(resetLogPath, line + "\n");
      } catch {
        // ignore file write errors in serverless / read-only fs
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
