import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@sqlite.org/sqlite-wasm"],
  reactStrictMode: false,
  rewrites: () => [
    {
      source: "/:database*/stats/:team",
      has: [{ type: "query", key: "page", value: "(?<page>.*)" }],
      destination: "/:database*/stats/:team/:page",
    },
  ],
  outputFileTracingExcludes: {
    "app/**/*": [".static/*"],
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
