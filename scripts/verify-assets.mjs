import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const packageJson = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8"));
const iconPath = packageJson.icon ? path.join("assets", packageJson.icon) : null;

const requiredFiles = ["assets/crickets.mp3", "src/crickets.tsx", ...(iconPath ? [iconPath] : [])];

const missingFiles = requiredFiles.filter((relativePath) => !existsSync(path.join(rootDir, relativePath)));

if (missingFiles.length > 0) {
  console.error("Missing required extension files:");
  for (const file of missingFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Asset verification passed.");
