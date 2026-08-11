import type { NextConfig } from "next";
import path from "path";

function strapiRemotePattern():
  | {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
      pathname: string;
    }
  | null {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);
    const protocol = url.protocol === "https:" ? "https" : "http";
    return {
      protocol,
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/uploads/**",
    };
  } catch {
    return null;
  }
}

const strapiPattern = strapiRemotePattern();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      ...(strapiPattern ? [strapiPattern] : []),
    ],
  },
};

export default nextConfig;
