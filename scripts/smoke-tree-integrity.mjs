import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const assertions = [
  {
    file: "app/api/family-members/[memberId]/route.ts",
    patterns: [
      "A member cannot be their own parent",
      "cycle detected",
      "Generation must equal parent generation + 1",
      "A member cannot be their own spouse",
    ],
  },
  {
    file: "app/api/family-members/route.ts",
    patterns: [
      "Generation must equal parent generation + 1",
      "One or more spouse IDs are invalid for active tenant",
    ],
  },
  {
    file: "app/(authenticate)/tree/components/family-tree/MemberDialog.tsx",
    patterns: ["const handleSave = async () =>", "const ok = await onSave("],
  },
];

for (const assertion of assertions) {
  const filePath = path.join(root, assertion.file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${assertion.file}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, "utf8");
  for (const pattern of assertion.patterns) {
    if (!content.includes(pattern)) {
      console.error(`Missing expected pattern in ${assertion.file}: "${pattern}"`);
      process.exit(1);
    }
  }
}

console.log("Tree integrity smoke checks passed.");
