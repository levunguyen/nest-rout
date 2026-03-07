import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "app/pricing/page.tsx",
  "app/(authenticate)/notifications/page.tsx",
  "app/(authenticate)/settings/page.tsx",
  "app/(authenticate)/tree/not-found.tsx",
  "app/(authenticate)/donate/not-found.tsx",
  "app/(authenticate)/tomb/not-found.tsx",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error("Missing required route files:");
  missing.forEach((m) => console.error(`- ${m}`));
  process.exit(1);
}

const targets = ["/pricing", "/notifications", "/settings"];
const codeFiles = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      codeFiles.push(full);
    }
  }
};

walk(path.join(root, "app"));
walk(path.join(root, "components"));

for (const target of targets) {
  let found = false;
  const pattern = new RegExp(`href=["']${target}["']`);
  for (const file of codeFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (pattern.test(content)) {
      found = true;
      break;
    }
  }
  if (!found) {
    console.error(`Expected to find at least one link to ${target}, but none was found.`);
    process.exit(1);
  }
}

console.log("Smoke checks passed.");
