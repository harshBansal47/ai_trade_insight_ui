import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function exchangeWithBackend(
  body: Record<string, string>,
  endpoint = "/auth/login"
): Promise<NextAuthUser> {
  console.log("🌐 [Backend Exchange] Calling:", `${API}${endpoint}`);
  console.log("📦 Payload:", body);

  const { data } = await axios.post(`${API}${endpoint}`, body, {
    headers: { "Content-Type": "application/json" },
    timeout: 10_000,
  });

  console.log("✅ [Backend Response]:", data);

  return {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    image: data.user.avatar ?? null,
    apiToken: data.token,
    points: data.points,
    createdAt: data.user.createdAt,
  };
}

export const authOptions: NextAuthOptions = {
  debug: true, // 🔥 enable NextAuth internal logs

  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/api/auth", error: "/api/auth?error=true", signOut: "/" },

  providers: [
    // ── Google OAuth ──────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),

    // ── Email + Password ──────────────────────────────────────────────────
    CredentialsProvider({
      id: "credentials-password",
      name: "Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🟣 [Authorize - Password] Triggered");
        console.log("📩 Credentials:", credentials);

        if (!credentials?.email || !credentials.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          const user = await exchangeWithBackend({
            email: credentials.email,
            password: credentials.password,
            method: "password",
          });

          console.log("✅ [Authorize - Password] User:", user);
          return user;
        } catch (err) {
          console.error("❌ [Authorize - Password] Error:", err);
          throw new Error(
            axios.isAxiosError(err)
              ? err.response?.data?.detail ?? "Invalid email or password"
              : "Login failed"
          );
        }
      },
    }),

    // ── Email + OTP ───────────────────────────────────────────────────────
    CredentialsProvider({
      id: "credentials-otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        console.log("🟣 [Authorize - OTP] Triggered");
        console.log("📩 Credentials:", credentials);

        if (!credentials?.email || !credentials.otp) {
          console.log("❌ Missing OTP credentials");
          return null;
        }

        try {
          const user = await exchangeWithBackend({
            email: credentials.email,
            otp: credentials.otp,
            method: "otp",
          });

          console.log("✅ [Authorize - OTP] User:", user);
          return user;
        } catch (err) {
          console.error("❌ [Authorize - OTP] Error:", err);
          throw new Error(
            axios.isAxiosError(err)
              ? err.response?.data?.detail ?? "Invalid OTP"
              : "OTP login failed"
          );
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      console.log("🟢 [signIn Callback]");
      console.log("👉 Provider:", account?.provider);
      console.log("👉 Incoming User:", user);
      console.log("👉 Account recieved in params:", account);


      if (account?.provider === "google" && account.id_token) {
        console.log("🌍 Google login detected, exchanging with backend...");

        try {
          const backendUser = await exchangeWithBackend(
            { id_token: account.id_token },
            "/auth/google"
          );

          console.log("✅ Backend Google User:", backendUser);
          user.id = backendUser.id;
          user.name = backendUser.name;
          user.email = backendUser.email;
          user.image = backendUser.image;

          // attach custom fields (VERY IMPORTANT for JWT/session)
          user.apiToken = backendUser.apiToken;
          user.points = backendUser.points;
          user.createdAt = backendUser.createdAt;


          return true;
        } catch (err) {
          console.error("❌ [Google Exchange Failed]:", err);
          return "/auth?error=GoogleFailed";
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      console.log("🔵 [JWT Callback]");
      console.log("👉 Existing Token:", token);

      if (user) {
        console.log("✨ New login detected → storing in JWT");

        token.userId = user.id;
        token.apiToken = user.apiToken;
        token.points = user.points;
        token.createdAt = user.createdAt;
      }

      if (trigger === "update") {
        console.log("🔄 JWT update triggered");
        console.log("👉 Session update payload:", session);

        if (typeof session?.points === "number") {
          token.points = session.points;
        }
      }

      console.log("✅ Final JWT:", token);

      return token;
    },

    async session({ session, token }) {
      console.log("🟡 [Session Callback]");
      console.log("👉 Token:", token);

      session.apiToken = token.apiToken;
      session.points = token.points;
      session.user.id = token.userId;
      session.user.createdAt = token.createdAt;

      console.log("✅ Final Session:", session);

      return session;
    },
  },
};