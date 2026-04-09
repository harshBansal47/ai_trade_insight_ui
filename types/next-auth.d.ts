import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    apiToken: string;
    points: number;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      createdAt?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    apiToken: string;
    points: number;
    createdAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken: string;
    points: number;
    userId: string;
    createdAt?: string;
  }
}