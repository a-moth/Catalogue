import { syncLabels, type Catalogue, type Entry } from "./catalogue.ts";
import { createISODate } from "./dates.ts";

// What a caller supplies; everything else is generated.
export type NewEntry = {
  title: string;
  description: string;
  tagIds?: string[];
  categoryIds?: string[];
  images?: Entry["images"];
  links?: Entry["links"];
  favourite?: boolean;
};

// Adds an entry and registers any new tag/category IDs it uses.
// Returns a new catalogue; the input is not modified.
export function createEntry(catalogue: Catalogue, input: NewEntry) {
  const entry: Entry = {
    id: crypto.randomUUID(),
    metadata: { created: createISODate(), modified: null },
    title: input.title.trim(),
    description: input.description.trim(),
    tagIds: [...new Set(input.tagIds ?? [])],
    categoryIds: [...new Set(input.categoryIds ?? [])],
    images: input.images ?? [],
    links: input.links ?? [],
    favourite: input.favourite ?? false,
  };

  const synced = syncLabels({
    ...catalogue,
    entries: [...catalogue.entries, entry],
  });

  return { ...synced, entry };
}
