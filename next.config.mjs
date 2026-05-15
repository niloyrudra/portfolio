/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },

  webpack: (config, { isServer }) => {
    if (isServer) config.cache = false
    return config
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",

              // 'unsafe-eval' is required by Next.js (used in its JS runtime)
              // 'unsafe-inline' is required for Next.js inline scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

              // ONE style-src directive — inline styles (Tailwind) + Google Fonts CSS
              // Having two style-src lines is wrong: CSP uses only the first one
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // Google Fonts font files
              "font-src 'self' https://fonts.gstatic.com",

              // Images: same origin, base64 data URIs, and any https image
              "img-src 'self' data: https:",

              // fetch() / XHR only to same origin
              "connect-src 'self'",

              // No iframes allowed (clickjacking protection)
              "frame-ancestors 'none'",

              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig