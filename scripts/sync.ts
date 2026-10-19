// Registers any tag/category IDs used by entries but missing from the
// catalogue, then validates the result. The file is only written if valid.
//
// Usage: npm run sync

import { syncLabels } from "../src/catalogue.ts";
import {
  assertValid,
  readCatalogue,
  reportNewLabels,
  writeCatalogue,
} from "./catalogue-file.ts";

const original = readCatalogue();

// Validate first so malformed IDs are reported rather than registered.
assertValid(original);

const { catalogue, newTags, newCategories } = syncLabels(original);
assertValid(catalogue);

reportNewLabels(newTags, newCategories);
if (newTags.length > 0 || newCategories.length > 0) writeCatalogue(catalogue);

console.log("✅ catalogue.json is valid");
