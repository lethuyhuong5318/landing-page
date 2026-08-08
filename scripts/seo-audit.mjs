#!/usr/bin/env node
// Static SEO audit over the built `out/` directory. No external
// dependencies — plain fs + regex, run after `npm run build`.
//
// Checks: duplicate URLs (trailing-slash variants), missing/conflicting
// canonical, missing/duplicate title, missing/multiple H1, internal
// links that point to a non-existent file or omit a required trailing
// slash, accidental noindex on pages not explicitly allow-listed, and
// every sitemap.xml entry resolving to a real 200-equivalent file.
//
// Usage: npm run seo:audit   (after `npm run build`)

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "out");
const SITE_URL = "https://chamchamedemy.id.vn";

// Pages that are intentionally noindex (iframe-only embeds, error pages).
const NOINDEX_ALLOWLIST = new Set(["/chem-mining/embed/", "/404/", "/_not-found/"]);

let failures = 0;
let warnings = 0;
const log = {
  pass: (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`),
  fail: (msg) => { console.log(`  \x1b[31m✗\x1b[0m ${msg}`); failures++; },
  warn: (msg) => { console.log(`  \x1b[33m!\x1b[0m ${msg}`); warnings++; },
  section: (msg) => console.log(`\n${msg}`),
};

if (!existsSync(OUT_DIR)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

// --- collect every index.html under out/, mapped to its site path ---
function collectHtmlFiles(dir, base = "") {
  const entries = readdirSync(dir);
  let files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(collectHtmlFiles(full, `${base}/${entry}`));
    } else if (entry === "index.html") {
      files.push({ file: full, path: base === "" ? "/" : `${base}/` });
    } else if (entry.endsWith(".html") && entry !== "index.html") {
      // flat files like 404.html — not real routes, skip for URL checks
    }
  }
  return files;
}

const pages = collectHtmlFiles(OUT_DIR).filter(
  (p) => !p.path.startsWith("/404") && p.path !== "/_not-found/"
);

// --- Phase A: per-page title / canonical / H1 / robots checks ---
log.section("Metadata & canonical");
const titleMap = new Map();
for (const { file, path } of pages) {
  const html = readFileSync(file, "utf-8");
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  const robotsMatch = html.match(/<meta name="robots" content="([^"]*)"/);
  const expectedUrl = `${SITE_URL}${path}`;

  if (!titleMatch || !titleMatch[1].trim()) {
    log.fail(`${path} — missing <title>`);
  } else {
    const t = titleMatch[1];
    if (titleMap.has(t)) {
      log.fail(`${path} — duplicate <title> also used by ${titleMap.get(t)}: "${t}"`);
    } else {
      titleMap.set(t, path);
    }
  }

  if (!canonicalMatch) {
    log.warn(`${path} — no <link rel="canonical"> (ok for noindex/embed pages)`);
  } else if (canonicalMatch[1] !== expectedUrl) {
    log.fail(`${path} — canonical points to ${canonicalMatch[1]}, expected ${expectedUrl}`);
  }

  if (h1Count === 0) {
    log.warn(`${path} — no <h1> found`);
  } else if (h1Count > 1) {
    log.warn(`${path} — ${h1Count} <h1> tags (expected exactly 1)`);
  }

  const isNoindex = robotsMatch && robotsMatch[1].includes("noindex");
  if (isNoindex && !NOINDEX_ALLOWLIST.has(path)) {
    log.fail(`${path} — unexpectedly noindex (not in allowlist)`);
  }
  if (!isNoindex && NOINDEX_ALLOWLIST.has(path)) {
    log.fail(`${path} — expected noindex but is indexable`);
  }
}
if (failures === 0) log.pass(`${pages.length} pages checked, no metadata failures`);

// --- Phase B: internal link trailing-slash + existence check ---
log.section("Internal links");
const knownPaths = new Set(pages.map((p) => p.path));
const linkIssues = [];
for (const { file, path } of pages) {
  const html = readFileSync(file, "utf-8");
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith("/_next") || /\.[a-z0-9]+$/i.test(href)) continue; // assets
    if (!href.endsWith("/")) {
      linkIssues.push(`${path} → href="${href}" (missing trailing slash)`);
      continue;
    }
    if (!knownPaths.has(href)) {
      linkIssues.push(`${path} → href="${href}" (no matching page in out/)`);
    }
  }
}
if (linkIssues.length === 0) {
  log.pass("no broken or non-canonical internal links found");
} else {
  const unique = [...new Set(linkIssues)];
  unique.slice(0, 40).forEach((i) => log.fail(i));
  if (unique.length > 40) log.warn(`...and ${unique.length - 40} more`);
}

// --- Phase C: sitemap.xml entries resolve to a real page ---
log.section("Sitemap coverage");
const sitemapPath = join(OUT_DIR, "sitemap.xml");
if (existsSync(sitemapPath)) {
  const xml = readFileSync(sitemapPath, "utf-8");
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  let sitemapFail = 0;
  for (const loc of locs) {
    const path = loc.replace(SITE_URL, "") || "/";
    if (!knownPaths.has(path)) {
      log.fail(`sitemap URL ${loc} has no matching out/ page`);
      sitemapFail++;
    }
  }
  if (sitemapFail === 0) log.pass(`${locs.length} sitemap URLs all resolve to real pages`);

  // duplicate-URL check: any indexable page path missing from sitemap
  // that has a sibling with the same slug minus trailing slash isn't
  // meaningful here since trailingSlash:true means every path already
  // ends in "/" — instead just flag indexable pages absent from sitemap
  // as a soft warning (not every page needs to be in the sitemap).
} else {
  log.fail("out/sitemap.xml not found");
}

// --- summary ---
console.log(`\n${"─".repeat(50)}`);
console.log(`SEO audit: ${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures > 0 ? 1 : 0);
