const nextConfig = {
  experimental: {
    // Resumed previews can restore compiled CSS from a different source revision.
    turbopackFileSystemCacheForDev: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["192.168.1.8"],
  async redirects() {
    return [
      { source: "/committees", destination: "/events", permanent: true },
      { source: "/committees/ypm", destination: "/events/ypm-2026", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ...(process.env.NODE_ENV === "production"
          ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]
          : []),
      ],
    }];
  },
};

export default nextConfig;
