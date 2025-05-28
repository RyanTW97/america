const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "strapi-s3-tricolor.s3.us-east-2.amazonaws.com",
      "servidor-tricolor-64a23aa2b643.herokuapp.com",
    ],
  },
};

export default nextConfig;
