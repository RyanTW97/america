// next.config.js

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "strapi-s3-tricolor.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**", // Permite cualquier ruta dentro de este hostname
      },
      {
        protocol: "https",
        hostname: "servidor-tricolor-64a23aa2b643.herokuapp.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
