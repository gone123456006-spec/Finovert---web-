/**
 * Verifies every root-absolute asset reference in the source resolves to a real
 * file in public/ using an EXACT, case-sensitive match.
 *
 * Windows dev servers resolve paths case-insensitively, so a wrong-case path
 * only 404s once deployed to Linux. This catches that before it ships.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const EXTENSIONS = "png|jpg|jpeg|webp|gif|svg|ico|avif|mp4|webm|pdf|txt|xml|json";
const SCAN_DIRS = [path.join(root, "src")];
const SCAN_FILES = [path.join(root, "index.html")];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function listPublicFiles() {
  const files = new Set();
  if (!fs.existsSync(publicDir)) return files;
  for (const full of walk(publicDir)) {
    files.add("/" + path.relative(publicDir, full).split(path.sep).join("/"));
  }
  return files;
}

const publicFiles = listPublicFiles();
const lowerIndex = new Map();
for (const f of publicFiles) lowerIndex.set(f.toLowerCase(), f);

const sourceFiles = [
  ...SCAN_DIRS.filter(fs.existsSync).flatMap((d) => walk(d)),
  ...SCAN_FILES.filter(fs.existsSync),
].filter((f) => /\.(tsx?|jsx?|css|html)$/.test(f));

const referenceRe = new RegExp(`["'\`(](/[^"'\`)]*?\\.(?:${EXTENSIONS}))["'\`)]`, "gi");

const missing = [];
const miscased = [];

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, i) => {
    for (const match of line.matchAll(referenceRe)) {
      const raw = match[1];
      if (raw.startsWith("//")) continue; // protocol-relative URL

      // Percent-encoded spaces are valid in URLs; compare against decoded form
      let ref = raw;
      try {
        ref = decodeURIComponent(raw);
      } catch {
        // malformed encoding — compare raw
      }
      if (publicFiles.has(ref)) continue;

      const actual = lowerIndex.get(ref.toLowerCase());
      const where = `${path.relative(root, file)}:${i + 1}`;
      if (actual) miscased.push({ where, ref, actual });
      else missing.push({ where, ref });
    }
  });
}

if (miscased.length) {
  console.error("\nWRONG CASE — works on Windows, 404s on Linux/production:");
  for (const m of miscased) console.error(`  ${m.where}\n    used:   ${m.ref}\n    actual: ${m.actual}`);
}

if (missing.length) {
  console.error("\nMISSING from public/ — will 404 everywhere:");
  for (const m of missing) console.error(`  ${m.where}  ->  ${m.ref}`);
}

if (miscased.length || missing.length) {
  console.error(`\n${miscased.length} wrong-case, ${missing.length} missing reference(s).`);
  process.exit(1);
}

console.log(`Public asset check passed (${publicFiles.size} files, ${sourceFiles.length} sources scanned).`);
