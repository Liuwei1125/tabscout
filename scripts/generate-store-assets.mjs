#!/usr/bin/env node
/* global console */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = resolve(root, "docs/assets/store");
mkdirSync(outDir, { recursive: true });

function magick(args) {
  execFileSync("magick", args, { stdio: "inherit" });
}

function makeScreenshot(input, output, title, subtitle) {
  const src = resolve(root, input);
  const dest = resolve(outDir, output);
  magick([
    "-size", "1280x800",
    "xc:#eef2f6",
    "(",
    src,
    "-resize", "980x680>",
    "-background", "#ffffff",
    "-gravity", "center",
    "-extent", "980x680",
    "-bordercolor", "#d8dee8",
    "-border", "1",
    ")",
    "-gravity", "center",
    "-geometry", "+0+38",
    "-composite",
    "-font", "Helvetica",
    "-fill", "#111827",
    "-pointsize", "34",
    "-gravity", "northwest",
    "-annotate", "+88+48", title,
    "-fill", "#526070",
    "-pointsize", "18",
    "-annotate", "+90+94", subtitle,
    dest
  ]);
}

makeScreenshot(
  "work/manual-qa-popup-initial.png",
  "screenshot-command-panel.png",
  "TabScout",
  "Fast local search for tabs, history, bookmarks, and groups."
);

makeScreenshot(
  "work/manual-qa-pregrant-selection.png",
  "screenshot-selection.png",
  "Clean Up Tabs",
  "Select matching tabs, skip pinned tabs, and undo recent closes."
);

makeScreenshot(
  "work/manual-qa-pregrant-options.png",
  "screenshot-options.png",
  "Local-First Settings",
  "Theme, permission, keyboard, and privacy controls in one place."
);

magick([
  "-size", "440x280",
  "xc:#f3f6fa",
  "(",
  resolve(root, "public/icons/icon-128.png"),
  "-resize", "74x74",
  ")",
  "-gravity", "northwest",
  "-geometry", "+34+34",
  "-composite",
  "-font", "Helvetica-Bold",
  "-fill", "#111827",
  "-pointsize", "30",
  "-annotate", "+124+45", "TabScout",
  "-font", "Helvetica",
  "-fill", "#536171",
  "-pointsize", "18",
  "-annotate", "+126+82", "Tabs, history, bookmarks",
  "-fill", "#ffffff",
  "-draw", "roundrectangle 34,134 406,222 12,12",
  "-stroke", "#d8dee8",
  "-strokewidth", "1",
  "-fill", "none",
  "-draw", "roundrectangle 34,134 406,222 12,12",
  "-stroke", "none",
  "-fill", "#111827",
  "-pointsize", "20",
  "-annotate", "+58+166", "Search github",
  "-fill", "#64748b",
  "-pointsize", "15",
  "-annotate", "+58+195", "Switch faster. Clean up safely.",
  resolve(outDir, "small-promo-tile.png")
]);

console.log(`Store assets generated in ${outDir}`);
