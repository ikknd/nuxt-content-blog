import { SitemapStream, streamToPromise } from 'sitemap'
import type { Collections } from '@nuxt/content'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // Fetch all documents from both collections
  // In server routes, queryCollection requires the event as second parameter
  const contentDocs = await queryCollection(event, 'content').all() as Collections['content'][]
  const articleDocs = await queryCollection(event, 'articles').all() as Collections['articles'][]
  const allDocs = [...contentDocs, ...articleDocs]
  
  const sitemap = new SitemapStream({
    hostname: 'https://ifomin.com',
  })

  const paths = new Set<string>()
  
  for (const doc of allDocs) {
    // Collection items from asSeoCollection have a path property
    const path = (doc as any).path || (doc as any)._path
    if (path) {
      paths.add(path)
      sitemap.write({
        url: path,
        changefreq: 'daily',
      })
    }
  }
  
  // Ensure root path is included (1.index.md might map to /index, not /)
  if (!paths.has('/')) {
    sitemap.write({
      url: '/',
      changefreq: 'daily',
    })
  }
  
  sitemap.end()

  return streamToPromise(sitemap)
})
