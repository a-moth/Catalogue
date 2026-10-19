// Adds an entry to catalogue.json. New tag/category IDs are registered
// automatically. The file is only written if the result is valid.
//
// Usage:
//   npm run add -- --title "Spoon theory" --description "…" \
//     --tag coping-skills --tag resource --category adhd \
//     --link "Article|https://example.com" --image "Diagram|https://…" \
//     --favourite

import { parseArgs } from "node:util";
import { createEntry } from "../src/entries.ts";
import {
  assertValid,
  readCatalogue,
  reportNewLabels,
  writeCatalogue,
} from "./catalogue-file.ts";

// "Title|https://…" -> { title, href }. Splits on the first "|".
function parseTitled(value: string, flag: string): { title: string; href: string } {
  const separator = value.indexOf("|");
  if (separator === -1) {
    console.error(`❌ --${flag} must look like "Title|https://…", got "${value}"`);
    process.exit(1);
  }
  return {
    title: value.slice(0, separator).trim(),
    href: value.slice(separator + 1).trim(),
  };
}

const { values } = parseArgs({
  options: {
    title: { type: "string" },
    description: { type: "string" },
    tag: { type: "string", multiple: true, default: [] },
    category: { type: "string", multiple: true, default: [] },
    link: { type: "string", multiple: true, default: [] },
    image: { type: "string", multiple: true, default: [] },
    favourite: { type: "boolean", default: false },
  },
});

if (!values.title || !values.description) {
  console.error("❌ --title and --description are required");
  process.exit(1);
}

const original = readCatalogue();
assertValid(original);

const { catalogue, entry, newTags, newCategories } = createEntry(original, {
  title: values.title,
  description: values.description,
  tagIds: values.tag,
  categoryIds: values.category,
  links: values.link.map((link) => parseTitled(link, "link")),
  images: values.image.map((image) => parseTitled(image, "image")),
  favourite: values.favourite,
});

assertValid(catalogue);
writeCatalogue(catalogue);

reportNewLabels(newTags, newCategories);
console.log(`✅ Added "${entry.title}" (${entry.id})`);
