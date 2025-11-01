/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: (() => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      try {
        if (!url) return []
        const u = new URL(url)
        return [
          {
            protocol: u.protocol.replace(':', ''),
            hostname: u.hostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      } catch {
        return []
      }
    })(),
  },
}

module.exports = nextConfig

