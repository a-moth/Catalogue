// Types mirroring catalogue.schema.json. `npm run sync` guarantees the data
// matches the schema, so the app can trust these shapes.

export type Label = {
  id: string;
  name: string;
};

export type Image = {
  title: string;
  href: string;
  width?: number;
  height?: number;
};

export type Link = {
  title: string;
  href: string;
};

export type Entry = {
  id: string;
  metadata: {
    created: string;
    modified: string | null;
  };
  title: string;
  description: string;
  tagIds: string[];
  categoryIds: string[];
  images: Image[];
  links: Link[];
  favourite: boolean;
};

export type Catalogue = {
  schemaVersion: 1;
  tags: Label[];
  categories: Label[];
  entries: Entry[];
};

// "coping-skills" -> "coping skills"; rename freely afterwards, the ID stays.
function nameFromId(id: string): string {
  return id.replace(/-/g, " ");
}

// Returns `labels` plus a new label for every ID not registered yet.
function registerLabels(
  labels: Label[],
  ids: Iterable<string>,
): { labels: Label[]; created: string[] } {
  const known = new Set(labels.map((label) => label.id));
  const created: string[] = [];

  for (const id of ids) {
    if (known.has(id)) continue;
    known.add(id);
    created.push(id);
  }

  return {
    labels: [...labels, ...created.map((id) => ({ id, name: nameFromId(id) }))],
    created,
  };
}

// Registers every tag/category ID used by an entry but missing from the
// catalogue's lists. Returns a new catalogue; the input is not modified.
export function syncLabels(catalogue: Catalogue): {
  catalogue: Catalogue;
  newTags: string[];
  newCategories: string[];
} {
  const tags = registerLabels(
    catalogue.tags,
    catalogue.entries.flatMap((entry) => entry.tagIds),
  );
  const categories = registerLabels(
    catalogue.categories,
    catalogue.entries.flatMap((entry) => entry.categoryIds),
  );

  return {
    catalogue: { ...catalogue, tags: tags.labels, categories: categories.labels },
    newTags: tags.created,
    newCategories: categories.created,
  };
}

// Resolves IDs to display names, skipping any that aren't registered.
export function namesFor(ids: string[], labels: Label[]): string[] {
  const byId = new Map(labels.map((label) => [label.id, label.name]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
