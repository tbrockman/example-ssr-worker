/** @jsx jsx */
import { jsx } from '@emotion/react'
import { CacheProvider } from '@emotion/react'
import { renderToString } from 'react-dom/server'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

import App from './frontend/app'

export default {
  async fetch(request: Request, env: any) {
    return await handleRequest(request, env)
  },
}

async function handleRequest(request: Request, env: any) {
  const key = 'custom'
  const cache = createCache({ key })
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)
  
  const html = renderToString(
    <CacheProvider value={cache}>
      <App text={'example'}/>
    </CacheProvider>
  )
  
  const chunks = extractCriticalToChunks(html)
  const styles = constructStyleTagsFromChunks(chunks)
    
  console.log(chunks, styles, html)
  return new Response(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>My site</title>
      ${styles}
  </head>
  <body>
      <div id="root">${html}</div>
  
      <script src="./bundle.js"></script>
  </body>
  </html>`, { headers: {'content-type': 'text/html'}})
}
