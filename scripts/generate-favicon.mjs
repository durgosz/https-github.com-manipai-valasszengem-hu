/**
 * Favicon generator — életfa motívum
 * Futtatás: node scripts/generate-favicon.mjs
 */
import { createRequire } from 'module'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const sharp = require('../node_modules/sharp')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const APP_DIR = join(ROOT, 'src/app')

// ─── SVG tervezés ───────────────────────────────────────────────────────────
// 100×100 viewBox, arany életfa sötét háttéren
// 3 szint ág (6 ág), 7 levél-pont, egyszerű törzs
const SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="16" fill="#0a0a0a"/>

  <!-- Törzs -->
  <line x1="50" y1="94" x2="50" y2="55"
    stroke="#C9A96E" stroke-width="6.5" stroke-linecap="round"/>

  <!-- 1. ágszint (legalsó, legszélesebb) -->
  <path d="M 50 78 Q 31 68 12 57"
    stroke="#C9A96E" stroke-width="5.5" fill="none" stroke-linecap="round"/>
  <path d="M 50 78 Q 69 68 88 57"
    stroke="#C9A96E" stroke-width="5.5" fill="none" stroke-linecap="round"/>

  <!-- 2. ágszint (középső) -->
  <path d="M 50 67 Q 35 55 21 42"
    stroke="#C9A96E" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M 50 67 Q 65 55 79 42"
    stroke="#C9A96E" stroke-width="4.5" fill="none" stroke-linecap="round"/>

  <!-- 3. ágszint (felső) -->
  <path d="M 50 58 Q 39 45 30 31"
    stroke="#C9A96E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M 50 58 Q 61 45 70 31"
    stroke="#C9A96E" stroke-width="3.5" fill="none" stroke-linecap="round"/>

  <!-- Csúcs -->
  <line x1="50" y1="55" x2="50" y2="12"
    stroke="#C9A96E" stroke-width="3.5" stroke-linecap="round"/>

  <!-- Levelek (körvégek) -->
  <circle cx="12" cy="57" r="6.5" fill="#C9A96E"/>
  <circle cx="88" cy="57" r="6.5" fill="#C9A96E"/>
  <circle cx="21" cy="42" r="5.5" fill="#C9A96E"/>
  <circle cx="79" cy="42" r="5.5" fill="#C9A96E"/>
  <circle cx="30" cy="31" r="4.5" fill="#C9A96E"/>
  <circle cx="70" cy="31" r="4.5" fill="#C9A96E"/>
  <circle cx="50" cy="12" r="5.5" fill="#C9A96E"/>
</svg>`

const svgBuf = Buffer.from(SVG)

// ─── ICO összeállítás ────────────────────────────────────────────────────────
function buildIco(entries) {
  // entries: [{ size, png }]
  const n = entries.length
  const headerSize = 6
  const dirEntrySize = 16
  const dataOffset = headerSize + dirEntrySize * n

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)  // reserved
  header.writeUInt16LE(1, 2)  // type: ICO
  header.writeUInt16LE(n, 4)

  const dir = Buffer.alloc(dirEntrySize * n)
  let offset = dataOffset
  entries.forEach(({ size, png }, i) => {
    const s = i * dirEntrySize
    dir.writeUInt8(size >= 256 ? 0 : size, s)      // width
    dir.writeUInt8(size >= 256 ? 0 : size, s + 1)   // height
    dir.writeUInt8(0, s + 2)                         // color count
    dir.writeUInt8(0, s + 3)                         // reserved
    dir.writeUInt16LE(1, s + 4)                      // planes
    dir.writeUInt16LE(32, s + 6)                     // bit count
    dir.writeUInt32LE(png.length, s + 8)             // size
    dir.writeUInt32LE(offset, s + 12)                // offset
    offset += png.length
  })

  return Buffer.concat([header, dir, ...entries.map(e => e.png)])
}

// ─── Fájlok generálása ───────────────────────────────────────────────────────
async function run() {
  console.log('Favicon generálás…')

  const [png16, png32, png48, png192, png180, png512] = await Promise.all([
    sharp(svgBuf, { density: 300 }).resize(16,  16,  { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(svgBuf, { density: 300 }).resize(32,  32,  { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(svgBuf, { density: 300 }).resize(48,  48,  { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(svgBuf, { density: 300 }).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(svgBuf, { density: 300 }).resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    sharp(svgBuf, { density: 300 }).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
  ])

  // favicon.ico — 16, 32, 48-as változatok egybe csomagolva
  const ico = buildIco([
    { size: 16, png: png16 },
    { size: 32, png: png32 },
    { size: 48, png: png48 },
  ])

  writeFileSync(join(APP_DIR, 'favicon.ico'), ico)
  console.log('  ✓ src/app/favicon.ico')

  writeFileSync(join(APP_DIR, 'icon.png'), png512)
  console.log('  ✓ src/app/icon.png  (512×512)')

  writeFileSync(join(APP_DIR, 'apple-icon.png'), png180)
  console.log('  ✓ src/app/apple-icon.png  (180×180)')

  // public/ másolatok (opcionális, néhány tool keresi itt)
  writeFileSync(join(ROOT, 'public', 'favicon.ico'), ico)
  writeFileSync(join(ROOT, 'public', 'apple-touch-icon.png'), png180)
  console.log('  ✓ public/favicon.ico + apple-touch-icon.png')

  console.log('\nKész!')
}

run().catch(e => { console.error(e); process.exit(1) })
