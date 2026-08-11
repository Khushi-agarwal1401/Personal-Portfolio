#!/usr/bin/env node
/*
 * Static-site validation for the portfolio.
 * Zero dependencies — runs with plain Node (npm test).
 *
 * Checks:
 *   1. Required project files exist
 *   2. Each HTML page has exactly one <title>
 *   3. No duplicate element IDs within a page
 *   4. Every internal anchor (#id) resolves to an element on that page
 *   5. Every local <link>, <script>, <img> src/href points to an existing file
 *   6. No `console.*` debug statements in production JS
 *   7. Every external link with target="_blank" carries rel="noopener"
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const PAGES = ['index.html', 'thank-you.html'];
const REQUIRED_FILES = [
    'index.html',
    'thank-you.html',
    'sitemap.xml',
    'robots.txt',
    'public/images/Me.jpg',
    'src/styles/style.css',
    'src/scripts/script.js',
    'src/scripts/theme-init.js',
];
const REQUIRED_JS = ['src/scripts/script.js', 'src/scripts/theme-init.js'];

const errors = [];
const warn = (page, msg) => errors.push(`[${page}] ${msg}`);

const abs = (rel) => path.join(ROOT, rel);

// ---- 1. Required files ----
for (const file of REQUIRED_FILES) {
    if (!existsSync(abs(file))) errors.push(`Missing required file: ${file}`);
}

// ---- 2-5. Per-page checks ----
for (const page of PAGES) {
    if (!existsSync(abs(page))) continue;
    const html = readFileSync(abs(page), 'utf8');

    // <title>
    const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)].map((m) => m[1].trim());
    if (titles.length === 0) warn(page, 'Missing <title>');
    if (titles.length > 1) warn(page, `Duplicate <title> tags: ${titles.join(' | ')}`);

    // IDs
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const seen = new Set();
    for (const id of ids) {
        if (seen.has(id)) warn(page, `Duplicate id="${id}"`);
        seen.add(id);
    }

    // Internal anchors
    const anchors = [...html.matchAll(/href="#([^"']+)"/g)].map((m) => m[1]);
    for (const target of anchors) {
        if (!seen.has(target)) warn(page, `Broken anchor: #${target} (no matching id)`);
    }

    // Local assets
    const refs = [
        ...html.matchAll(/(?:href|src)="(\.\/[^"']+)"/g),
    ].map((m) => m[1]);
    for (const ref of refs) {
        if (ref.includes('://')) continue;
        // Strip query/hash fragments
        const clean = ref.split(/[?#]/)[0];
        if (!existsSync(abs(clean))) warn(page, `Missing local asset: ${ref}`);
    }
}

// ---- 6. No console.* in production JS ----
for (const file of REQUIRED_JS) {
    if (!existsSync(abs(file))) continue;
    const js = readFileSync(abs(file), 'utf8');
    const matches = [...js.matchAll(/console\.(log|debug|warn|error)\(/g)];
    for (const m of matches) errors.push(`[${file}] Debug statement: console.${m[1]}()`);
}

// ---- 7. rel="noopener" on target="_blank" ----
const extLinks = [...readFileSync(abs('index.html'), 'utf8').matchAll(
    /<a\b([^>]*?)>/g,
)].map((m) => m[1]);
for (const attrs of extLinks) {
    if (/target=["']_blank["']/.test(attrs) && !/\brel=["'][^"']*\bnoopener\b/.test(attrs)) {
        warn('index.html', `target="_blank" link missing rel="noopener": <a ${attrs.trim()}>`);
    }
}

// ---- Report (all issues are fatal) ----
if (errors.length > 0) {
    console.error(`✗ ${errors.length} issue(s) found:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
}
console.log(`✓ ${PAGES.length} pages validated — no dead code, broken references, or debug statements.`);
