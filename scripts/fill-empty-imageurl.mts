/**
 * 用 ARASAAC 确认过的 ID 补全 public/seed/pictograms.json 里的空 imageUrl。
 * 只修改 imageUrl === "" 的条目，其余字段和顺序完全不变。
 *
 * 运行方式：
 *   npx tsx scripts/fill-empty-imageurl.mts
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedPath = path.resolve(__dirname, '../public/seed/pictograms.json')

// ARASAAC ID 经 API 实时验证（2026-05-07）
const URL_MAP: Record<string, string> = {
  // 医疗症状
  p_bleed:          'https://static.arasaac.org/pictograms/2803/2803_300.png',
  p_fever:          'https://static.arasaac.org/pictograms/32530/32530_300.png',
  p_breathe:        'https://static.arasaac.org/pictograms/34377/34377_300.png',
  p_cough:          'https://static.arasaac.org/pictograms/3406/3406_300.png',
  // 身体部位
  p_head:           'https://static.arasaac.org/pictograms/2673/2673_300.png',
  p_dizzy:          'https://static.arasaac.org/pictograms/2464/2464_300.png',
  p_arm_body:       'https://static.arasaac.org/pictograms/2669/2669_300.png',
  p_eye_body:       'https://static.arasaac.org/pictograms/6573/6573_300.png',
  p_ear_body:       'https://static.arasaac.org/pictograms/2871/2871_300.png',
  p_belly:          'https://static.arasaac.org/pictograms/2786/2786_300.png',
  p_shoulder:       'https://static.arasaac.org/pictograms/2977/2977_300.png',
  p_back_body:      'https://static.arasaac.org/pictograms/7775/7775_300.png',
  p_chest:          'https://static.arasaac.org/pictograms/2853/2853_300.png',
  p_neck:           'https://static.arasaac.org/pictograms/2727/2727_300.png',
  p_foot_body:      'https://static.arasaac.org/pictograms/25327/25327_300.png',
  p_leg_body:       'https://static.arasaac.org/pictograms/8666/8666_300.png',
  p_wheelchair:     'https://static.arasaac.org/pictograms/25471/25471_300.png',
  // 时间
  p_always:         'https://static.arasaac.org/pictograms/17322/17322_300.png',
  p_weekend:        'https://static.arasaac.org/pictograms/27329/27329_300.png',
  p_everyday:       'https://static.arasaac.org/pictograms/37371/37371_300.png',
  p_wait:           'https://static.arasaac.org/pictograms/36914/36914_300.png',
  p_soon:           'https://static.arasaac.org/pictograms/5306/5306_300.png',
  // 活动
  p_change_clothes: 'https://static.arasaac.org/pictograms/6627/6627_300.png',
  p_haircut:        'https://static.arasaac.org/pictograms/28683/28683_300.png',
  p_read_book:      'https://static.arasaac.org/pictograms/2447/2447_300.png',
  p_watch_tv:       'https://static.arasaac.org/pictograms/29123/29123_300.png',
  p_exercise:       'https://static.arasaac.org/pictograms/10156/10156_300.png',
  // 物品
  p_book:           'https://static.arasaac.org/pictograms/25191/25191_300.png',
  p_bag:            'https://static.arasaac.org/pictograms/23849/23849_300.png',
  p_bed:            'https://static.arasaac.org/pictograms/25900/25900_300.png',
  p_cup:            'https://static.arasaac.org/pictograms/2582/2582_300.png',
  p_pillow:         'https://static.arasaac.org/pictograms/2250/2250_300.png',
  p_chair:          'https://static.arasaac.org/pictograms/3155/3155_300.png',
  p_computer:       'https://static.arasaac.org/pictograms/7190/7190_300.png',
  p_television:     'https://static.arasaac.org/pictograms/25498/25498_300.png',
  p_glasses:        'https://static.arasaac.org/pictograms/3329/3329_300.png',
  p_bowl:           'https://static.arasaac.org/pictograms/3257/3257_300.png',
  p_pen:            'https://static.arasaac.org/pictograms/10313/10313_300.png',
  p_tissue:         'https://static.arasaac.org/pictograms/8647/8647_300.png',
  p_clothes:        'https://static.arasaac.org/pictograms/7233/7233_300.png',
  p_remote:         'https://static.arasaac.org/pictograms/26182/26182_300.png',
  p_key:            'https://static.arasaac.org/pictograms/8153/8153_300.png',
  p_umbrella:       'https://static.arasaac.org/pictograms/2500/2500_300.png',
}

let raw = readFileSync(seedPath, 'utf-8')

let updated = 0
for (const [id, url] of Object.entries(URL_MAP)) {
  // 精确匹配：只替换 "id": "<id>" 块里紧跟的空 imageUrl
  const pattern = new RegExp(
    `("id":\\s*"${id}",[\\s\\S]*?"imageUrl":\\s*)""`
  )
  const before = raw
  raw = raw.replace(pattern, `$1"${url}"`)
  if (raw !== before) updated++
}

writeFileSync(seedPath, raw, 'utf-8')
console.log(`✓ Updated ${updated} / ${Object.keys(URL_MAP).length} entries`)

// 验证：解析 JSON，确保无空 imageUrl、无重复
const entries = JSON.parse(raw) as Array<{ id: string; imageUrl: string }>
const emptyCount = entries.filter(e => e.imageUrl === '').length
const urlCounts = new Map<string, string[]>()
for (const e of entries) {
  if (!e.imageUrl) continue
  if (!urlCounts.has(e.imageUrl)) urlCounts.set(e.imageUrl, [])
  urlCounts.get(e.imageUrl)!.push(e.id)
}
const dups = [...urlCounts.entries()].filter(([, ids]) => ids.length > 1)

console.log(`Empty imageUrl remaining: ${emptyCount}`)
if (dups.length > 0) {
  console.log('Duplicate imageUrls:')
  for (const [url, ids] of dups) {
    console.log(`  ${ids.join(', ')} → ${url.slice(0, 60)}`)
  }
} else {
  console.log('No duplicate imageUrls ✓')
}
