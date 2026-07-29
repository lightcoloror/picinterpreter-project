import https from 'https'
import http from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seed = JSON.parse(readFileSync(path.join(__dirname, '../public/seed/pictograms.json'), 'utf8'))

const quickchat = seed.filter(e => e.categoryId === 'quickchat')

function check(url) {
  return new Promise(resolve => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve({ status: res.statusCode, url })
    })
    req.on('error', () => resolve({ status: 'ERR', url }))
    req.setTimeout(8000, () => { req.destroy(); resolve({ status: 'TIMEOUT', url }) })
    req.end()
  })
}

for (const e of quickchat) {
  const { status } = await check(e.imageUrl)
  const ok = status === 200
  if (!ok) console.log(`FAIL ${status}  ${e.id} (${e.labels.zh[0]})`)
  else      console.log(`ok   ${status}  ${e.id}`)
  await new Promise(r => setTimeout(r, 120))
}
