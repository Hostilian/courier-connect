const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'hostilian.org'],
  },
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig);
