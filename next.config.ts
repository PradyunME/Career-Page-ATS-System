import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The application form accepts a resume attachment. Keep the route on Node.js
  // (not Edge) so Nodemailer can open an SMTP connection.
};

export default nextConfig;
