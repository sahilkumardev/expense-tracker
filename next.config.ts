import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Auth redirects
      {
        source: "/verify-email",
        destination: "/auth/verify-email",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/auth/sign-in",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/auth/sign-up",
        permanent: true,
      },
      {
        source: "/email-verified",
        destination: "/auth/email-verified",
        permanent: true,
      },
      {
        source: "/forgot-password",
        destination: "/auth/forgot-password",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "/auth/reset-password",
        permanent: true,
      },
      // Dashboard redirects
      {
        source: "/settings",
        destination: "/dashboard/settings",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/dashboard/help",
        permanent: true,
      },
      {
        source: "/calendar",
        destination: "/dashboard/calendar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
