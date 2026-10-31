/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build the site as plain HTML files for Firebase Hosting (no server).
  output: "export",

  // Each page becomes a folder with index.html, e.g. /projects/abc/index.html.
  // Firebase Hosting serves this structure reliably.
  trailingSlash: true,

  // Next.js image optimization needs a server, so it is turned off.
  // Images are compressed manually before they go into the project.
  images: {
    unoptimized: true,
  },

  // Connects Tailwind CSS to Turbopack. Do not remove.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;