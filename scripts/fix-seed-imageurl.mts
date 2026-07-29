/**
 * 修复 public/seed/pictograms.json 里的所有 imageUrl 问题：
 *   1. 补全 43 条空 imageUrl（ARASAAC API 实时验证，2026-05-07）
 *   2. 纠正 10 处重复 imageUrl（今天提交引入的错误）
 *   3. 纠正 2 处 categoryId 与 semanticDomain 不一致
 *
 * 用字符串替换而非 JSON.stringify，完全保留原文件格式和字段顺序。
 *
 * 运行：npx tsx scripts/fix-seed-imageurl.mts
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedPath = path.resolve(__dirname, '../public/seed/pictograms.json')

// ─── 1. 空 imageUrl → 补全（ARASAAC 验证过的 ID） ─────────────────────────
const FILL_EMPTY: Record<string, string> = {
  p_bleed:          'https://static.arasaac.org/pictograms/2803/2803_300.png',
  p_fever:          'https://static.arasaac.org/pictograms/32530/32530_300.png',
  p_breathe:        'https://static.arasaac.org/pictograms/34377/34377_300.png',
  p_cough:          'https://static.arasaac.org/pictograms/3406/3406_300.png',
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
  p_always:         'https://static.arasaac.org/pictograms/17322/17322_300.png',
  p_weekend:        'https://static.arasaac.org/pictograms/27329/27329_300.png',
  p_everyday:       'https://static.arasaac.org/pictograms/37371/37371_300.png',
  p_wait:           'https://static.arasaac.org/pictograms/36914/36914_300.png',
  p_soon:           'https://static.arasaac.org/pictograms/5306/5306_300.png',
  p_change_clothes: 'https://static.arasaac.org/pictograms/6627/6627_300.png',
  p_haircut:        'https://static.arasaac.org/pictograms/28683/28683_300.png',
  p_read_book:      'https://static.arasaac.org/pictograms/2447/2447_300.png',
  p_watch_tv:       'https://static.arasaac.org/pictograms/29123/29123_300.png',
  p_exercise:       'https://static.arasaac.org/pictograms/10156/10156_300.png',
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

// ─── 2. 重复 imageUrl → 纠正（只改第二个条目，保留原始 owner） ─────────────
// 格式：id → 正确的 URL
const FIX_DUPLICATES: Record<string, string> = {
  // p_nausea 用了和 p_sick 相同的 39620；正确 ID 38403 = "恶心"
  p_nausea:        'https://static.arasaac.org/pictograms/38403/38403_300.png',
  // p_caregiver 用了和 p_friend 相同的 8486；正确 ID 15994 = "看护人"
  p_caregiver:     'https://static.arasaac.org/pictograms/15994/15994_300.png',
  // p_therapist 用了和 p_rehab 相同的 25165；正确 ID 2454 = speech therapist
  p_therapist:     'https://static.arasaac.org/pictograms/2454/2454_300.png',
  // p_take_medicine 用了和 p_medicine 相同的 GlobalSymbols；正确 ID 2855 = pills
  p_take_medicine: 'https://static.arasaac.org/pictograms/2855/2855_300.png',
  // p_make_call 用了和 p_call 相同的 6552；正确 ID 36305 = "打电话"
  p_make_call:     'https://static.arasaac.org/pictograms/36305/36305_300.png',
  // p_headache/stomachache/chest_pain 全用了 p_pain 的通用痛图 2367
  p_headache:      'https://static.arasaac.org/pictograms/28651/28651_300.png',
  p_stomachache:   'https://static.arasaac.org/pictograms/28766/28766_300.png',
  p_chest_pain:    'https://static.arasaac.org/pictograms/28781/28781_300.png',
  // p_water 用了和 p_喝水 相同的 37207；32464 = 纯"水"对象图
  p_water:         'https://static.arasaac.org/pictograms/32464/32464_300.png',
  // p_想要 用了和 p_want 相同的 GlobalSymbols；37160 = "need"
  'p_想要':        'https://static.arasaac.org/pictograms/37160/37160_300.png',
}

// ─── 3. categoryId 不一致修正 ────────────────────────────────────────────
// p_phone 和 p_make_call 的 categoryId 是 "activities"，与 semanticDomain 不符
const FIX_CATEGORY: Record<string, { from: string; to: string }> = {
  p_phone:     { from: 'activities', to: 'objects' },
  p_make_call: { from: 'activities', to: 'actions' },
}

// ─── 应用所有修复 ─────────────────────────────────────────────────────────

let raw = readFileSync(seedPath, 'utf-8')

function replaceImageUrl(content: string, id: string, newUrl: string, matchEmpty = false): string {
  const urlPattern = matchEmpty ? '""' : '"[^"]*"'
  const pattern = new RegExp(
    `("id":\\s*"${escapeRegex(id)}",[\\s\\S]*?"imageUrl":\\s*)${urlPattern}`
  )
  return content.replace(pattern, `$1"${newUrl}"`)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let fillCount = 0
for (const [id, url] of Object.entries(FILL_EMPTY)) {
  const before = raw
  raw = replaceImageUrl(raw, id, url, true)
  if (raw !== before) fillCount++
}

let dupCount = 0
for (const [id, url] of Object.entries(FIX_DUPLICATES)) {
  const before = raw
  raw = replaceImageUrl(raw, id, url, false)
  if (raw !== before) dupCount++
}

let catCount = 0
for (const [id, fix] of Object.entries(FIX_CATEGORY)) {
  const pattern = new RegExp(
    `("id":\\s*"${escapeRegex(id)}",[\\s\\S]*?"categoryId":\\s*)"${fix.from}"`
  )
  const before = raw
  raw = raw.replace(pattern, `$1"${fix.to}"`)
  if (raw !== before) catCount++
}

writeFileSync(seedPath, raw, 'utf-8')

console.log(`✓ Filled empty URLs:    ${fillCount} / ${Object.keys(FILL_EMPTY).length}`)
console.log(`✓ Fixed duplicate URLs: ${dupCount} / ${Object.keys(FIX_DUPLICATES).length}`)
console.log(`✓ Fixed categoryId:     ${catCount} / ${Object.keys(FIX_CATEGORY).length}`)

// ─── 验证 ─────────────────────────────────────────────────────────────────

type Entry = { id: string; imageUrl: string; categoryId: string; disambiguationHints: { semanticDomain?: string } }
const entries = JSON.parse(raw) as Entry[]

const emptyCount = entries.filter(e => e.imageUrl === '').length
const urlMap = new Map<string, string[]>()
for (const e of entries) {
  if (!e.imageUrl) continue
  if (!urlMap.has(e.imageUrl)) urlMap.set(e.imageUrl, [])
  urlMap.get(e.imageUrl)!.push(e.id)
}
const dups = [...urlMap.entries()].filter(([, ids]) => ids.length > 1)

const categoryMismatches = entries.filter(e => {
  const sd = e.disambiguationHints?.semanticDomain
  return sd && e.categoryId !== sd
})

console.log('\n─── 验证结果 ───────────────────────────────────────')
console.log(`空 imageUrl:            ${emptyCount}  ${emptyCount === 0 ? '✓' : '✗'}`)
console.log(`重复 imageUrl:          ${dups.length}  ${dups.length === 0 ? '✓' : '✗'}`)
console.log(`categoryId ≠ semanticDomain: ${categoryMismatches.length}  ${categoryMismatches.length === 0 ? '✓' : '(见下)'}`)

if (dups.length > 0) {
  console.log('\nDuplicate imageUrls:')
  for (const [url, ids] of dups) {
    console.log(`  ${ids.join(', ')} → ${url.slice(0, 70)}`)
  }
}
if (categoryMismatches.length > 0) {
  console.log('\ncategoryId ≠ semanticDomain:')
  for (const e of categoryMismatches) {
    console.log(`  ${e.id}: categoryId="${e.categoryId}" semanticDomain="${e.disambiguationHints.semanticDomain}"`)
  }
}
