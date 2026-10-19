// Registers any tag/category IDs used by entries but missing from the
// catalogue, then validates the result. The file is only written if valid.
//
// Usage: npm run sync

import { readFileSync, writeFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const CATALOGUE_PATH = new URL("../catalogue.json", import.meta.url);
const SCHEMA_PATH = new URL("../catalogue.schema.json", import.meta.url);

type Label = { id: string; name: string };

type Catalogue = {
  tags: Label[];
  categories: Label[];
  entries: { id: string; tagIds: string[]; categoryIds: string[] }[];
};

// "coping-skills" -> "coping skills"; rename freely afterwards, the ID stays.
function nameFromId(id: string): string {
  return id.replace(/-/g, " ");
}

// Adds a label for every referenced ID that isn't registered yet.
// Returns the IDs that were created.
function registerMissing(
  labels: Label[],
  referencedIds: Iterable<string>,
): string[] {
  const known = new Set(labels.map((label) => label.id));
  const created: string[] = [];

  for (const id of referencedIds) {
    if (known.has(id)) continue;
    labels.push({ id, name: nameFromId(id) });
    known.add(id);
    created.push(id);
  }

  return created;
}

function validate(catalogue: unknown): string[] {
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);

  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
  const isValid = ajv.validate(schema, catalogue);

  return isValid
    ? []
    : (ajv.errors ?? []).map(
        (error) => `${error.instancePath || "/"} ${error.message}`,
      );
}

// Things a schema can't express: unique IDs within each list.
function checkUniqueIds(catalogue: Catalogue): string[] {
  const problems: string[] = [];
  const lists = {
    tags: catalogue.tags,
    categories: catalogue.categories,
    entries: catalogue.entries,
  };

  for (const [listName, items] of Object.entries(lists)) {
    const seen = new Set<string>();
    for (const { id } of items) {
      if (seen.has(id)) problems.push(`/${listName} duplicate id "${id}"`);
      seen.add(id);
    }
  }

  return problems;
}

const catalogue = JSON.parse(readFileSync(CATALOGUE_PATH, "utf8")) as Catalogue;

// Validate first so malformed IDs are reported rather than registered.
const before = validate(catalogue);
if (before.length > 0) {
  console.error("❌ catalogue.json is invalid:");
  for (const problem of before) console.error(`   ${problem}`);
  process.exit(1);
}

const newTags = registerMissing(
  catalogue.tags,
  catalogue.entries.flatMap((entry) => entry.tagIds),
);
const newCategories = registerMissing(
  catalogue.categories,
  catalogue.entries.flatMap((entry) => entry.categoryIds),
);

const problems = [...validate(catalogue), ...checkUniqueIds(catalogue)];
if (problems.length > 0) {
  console.error("❌ catalogue.json is invalid:");
  for (const problem of problems) console.error(`   ${problem}`);
  process.exit(1);
}

for (const id of newTags) console.log(`➕ New tag created: ${id}`);
for (const id of newCategories) console.log(`➕ New category created: ${id}`);

if (newTags.length > 0 || newCategories.length > 0) {
  writeFileSync(CATALOGUE_PATH, JSON.stringify(catalogue, null, 2) + "\n");
}

console.log("✅ catalogue.json is valid");
