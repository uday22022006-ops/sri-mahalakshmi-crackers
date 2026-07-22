import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://smlcrackers.in',
      readable: true,
      exclude: ['/admin', '/admin/login', '/admin/dashboard'],
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/admin/login', '/admin/dashboard'],
        }
      ]
    }),
  ],
})

