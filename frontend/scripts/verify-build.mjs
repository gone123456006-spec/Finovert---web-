/**
 * Post-build production sanity checks.
 *
 * Catches the failure modes that only appear after deployment:
 *  1. index.html referencing an asset that was not emitted (blank page / 404).
 *  2. Circular imports between output chunks, which make a chunk run before
 *     its dependency has initialised ("Cannot access X before initialization").
 *  3. Absolute filesystem paths accidentally baked into the bundle.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

const problems = [];

if (!fs.existsSync(dist)) {
  console.error("verify-build: dist/ not found — run the build first.");
  process.exit(1);
}

// ── 1. Every asset referenced by index.html must exist ───────────────────────
const indexPath = path.join(dist, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const referenced = [...html.matchAll(/(?:src|href)="(\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);

for (const ref of referenced) {
  const onDisk = path.join(dist, ref);
  if (!fs.existsSync(onDisk)) {
    problems.push(`index.html references missing asset: ${ref}`);
  }
}

// ── 2. Chunk-level circular imports ──────────────────────────────────────────
const assetsDir = path.join(dist, "assets");
const jsFiles = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).filter((f) => f.endsWith(".js"))
  : [];

const graph = new Map();
for (const file of jsFiles) {
  const code = fs.readFileSync(path.join(assetsDir, file), "utf8");
  const deps = new Set();
  // static imports/re-exports only; dynamic import() is lazy and cannot deadlock init
  for (const m of code.matchAll(/(?:^|[;\s])(?:import|export)\s*(?:[^"';]*?\sfrom\s*)?["']\.\/([^"']+\.js)["']/g)) {
    if (m[1] !== file) deps.add(m[1]);
  }
  graph.set(file, deps);
}

const WHITE = 0, GREY = 1, BLACK = 2;
const colour = new Map(jsFiles.map((f) => [f, WHITE]));
const stack = [];

function visit(node) {
  colour.set(node, GREY);
  stack.push(node);
  for (const dep of graph.get(node) ?? []) {
    if (!colour.has(dep)) continue;
    if (colour.get(dep) === GREY) {
      const cycle = stack.slice(stack.indexOf(dep)).concat(dep).join(" -> ");
      problems.push(`circular chunk import: ${cycle}`);
    } else if (colour.get(dep) === WHITE) {
      visit(dep);
    }
  }
  stack.pop();
  colour.set(node, BLACK);
}

for (const file of jsFiles) {
  if (colour.get(file) === WHITE) visit(file);
}

// ── 3. No local filesystem paths leaked into the bundle ──────────────────────
for (const file of jsFiles) {
  const code = fs.readFileSync(path.join(assetsDir, file), "utf8");
  if (/[A-Za-z]:\\\\?(?:Users|fiinovertt)/.test(code)) {
    problems.push(`local filesystem path baked into ${file}`);
  }
  if (code.includes("http://localhost:5000")) {
    problems.push(`${file} contains a hardcoded localhost API URL`);
  }
}

if (problems.length) {
  console.error("\nverify-build FAILED:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`verify-build passed (${jsFiles.length} chunks, ${referenced.length} entry assets).`);
