/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: `npm run build` writes plain files to the `out` folder.
  output: "export",
  images: { unoptimized: true },
  // Lets phones/tablets on your Wi-Fi use the dev server with hot reload.
  // Add your machine's current LAN address here if it changes.
  allowedDevOrigins: ["192.168.100.55", "192.168.*.*"],
};
export default nextConfig;
