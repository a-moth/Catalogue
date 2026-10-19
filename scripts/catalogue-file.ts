// Reading, validating and writing catalogue.json. Shared by the scripts.

import { readFileSync, writeFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { Catalogue } from "../src/catalogue.ts";

const CATALOGUE_PATH = new URL("../catalogue.json", import.meta.url);
const SCHEMA_PATH = new URL("../catalogue.schema.json", import.meta.url);

export function readCatalogue(): Catalogue {
  return JSON.parse(readFileSync(CATALOGUE_PATH, "utf8")) as Catalogue;
}

export function writeCatalogue(catalogue: Catalogue): void {
  writeFileSync(CATALOGUE_PATH, JSON.stringify(catalogue, null, 2) + "\n");
}

function checkSchema(catalogue: unknown): string[] {
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

// Exits the process with a report if the catalogue is invalid.
export function assertValid(catalogue: Catalogue): void {
  const schemaProblems = checkSchema(catalogue);
  const problems =
    schemaProblems.length > 0 ? schemaProblems : checkUniqueIds(catalogue);

  if (problems.length === 0) return;

  console.error("❌ catalogue.json is invalid:");
  for (const problem of problems) console.error(`   ${problem}`);
  process.exit(1);
}

export function reportNewLabels(newTags: string[], newCategories: string[]): void {
  for (const id of newTags) console.log(`➕ New tag created: ${id}`);
  for (const id of newCategories) console.log(`➕ New category created: ${id}`);
}
