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

// Resolves IDs to display names, skipping any that aren't registered.
export function namesFor(ids: string[], labels: Label[]): string[] {
  const byId = new Map(labels.map((label) => [label.id, label.name]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
