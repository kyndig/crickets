import process from "node:process";
import fs from "node:fs";
import path from "node:path";

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const dependencies = Object.keys(packageJson.dependencies ?? {});
const allowedDependencies = new Set(["@raycast/api"]);
const extraDependencies = dependencies.filter((dependency) => !allowedDependencies.has(dependency));

if (extraDependencies.length > 0) {
  console.error("Unexpected runtime dependencies detected:");
  for (const dependency of extraDependencies) {
    console.error(`- ${dependency}`);
  }
  process.exit(1);
}

console.log("Dependency verification passed.");
