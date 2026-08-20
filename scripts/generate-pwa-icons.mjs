import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const sourceSvg = readFileSync(
  path.join(projectRoot, "src/assets/pwa/icon-source.svg")
);

const targets = [
  { file: "public/pwa-192x192.png", size: 192 },
  { file: "public/pwa-512x512.png", size: 512 },
  { file: "public/apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  const outPath = path.join(projectRoot, file);
  await sharp(sourceSvg).resize(size, size).png().toFile(outPath);
  console.log(`Wrote ${file} (${size}x${size})`);
}
