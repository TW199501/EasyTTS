import { Application } from 'express'
import express from 'express'
import path from 'path'

interface StaticConfig {
  audioDir: string
  publicDir: string
}

export function configureStaticFiles(
  app: Application,
  { audioDir, publicDir }: StaticConfig
): void {
  app.use(express.static(audioDir))
  app.use(express.static(publicDir))

  // SPA fallback: serve index.html for all non-API routes
  app.get('{*path}', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}
