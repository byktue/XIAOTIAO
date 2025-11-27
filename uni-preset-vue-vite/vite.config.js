import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // Dev-only middleware to add security and cache headers for Lighthouse/local testing
    {
      name: 'dev-headers',
      configureServer(server) {
        // Simple proxy endpoint to fetch third-party resources through dev-server
        // Use in pages as `/_proxy?url=${encodeURIComponent(theUrl)}` when you need
        // Lighthouse to see headers for third-party assets during local testing.
        server.middlewares.use('/_proxy', async (req, res, next) => {
          try {
            const full = req.url || ''
            const u = new URL(full, 'http://localhost')
            const target = u.searchParams.get('url')
            if (!target) {
              res.statusCode = 400
              res.end('Missing url query param')
              return
            }

            // Use global fetch if available (Node 18+), otherwise dynamic import node-fetch
            const doFetch = (typeof fetch === 'function') ? fetch : (...args) => import('node-fetch').then(m => m.default(...args))
            const r = await doFetch(target)
            res.statusCode = r.status || 200

            // Copy content-type or fallback
            const contentType = r.headers && (r.headers.get ? r.headers.get('content-type') : r.headers['content-type']) || 'application/octet-stream'
            res.setHeader('Content-Type', contentType)

            // Security & caching headers to satisfy Lighthouse in local testing
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.setHeader('Cache-Control', 'public, max-age=3600')
            res.setHeader('X-Frame-Options', 'SAMEORIGIN')

            const ab = await r.arrayBuffer()
            res.end(Buffer.from(ab))
            return
          } catch (err) {
            // Proxy errors shouldn't break dev server
            // eslint-disable-next-line no-console
            console.error('[dev-proxy] error fetching', err)
            res.statusCode = 502
            res.end('Proxy error')
            return
          }
        })

        server.middlewares.use((req, res, next) => {
          try {
            // Prevent MIME type sniffing
            res.setHeader('X-Content-Type-Options', 'nosniff')
            // Explicit cache control for dev (avoid stale content warnings)
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            // Basic clickjacking protection for local testing
            res.setHeader('X-Frame-Options', 'SAMEORIGIN')

            // Normalize Content-Type for common static assets with charset
            const url = req.url || ''
            if (url.endsWith('.js')) {
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
            } else if (url.endsWith('.css')) {
              res.setHeader('Content-Type', 'text/css; charset=utf-8')
            } else if (url.endsWith('.html') || url === '/' || url.endsWith('.htm')) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
            } else if (url.endsWith('.json')) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
            }
          } catch (e) {
            // ignore header errors
          }
          next()
        })
      }
    }
  ],
})
