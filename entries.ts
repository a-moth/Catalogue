import { create } from "xmlbuilder2";

export function createISODate(): string {
  return new Date().toISOString();
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function compareDates(a: string, b: string): number {
  return new Date(a).getTime() - new Date(b).getTime();
}

// this doesn't need to be an interface, but a type, probably.
interface CatalogEntry {
  id: string;
  created: string;
  title: string;
  description: string;
  tags: string[];
  category: string[];
  favourite: boolean;
}

function createEntry(
  title: string,
  description: string,
  tags: string[],
  categories: string[],
) {
  const root = create().ele("entry", {
    id: crypto.randomUUID(),
  });

  root.ele("metadata").ele("created").txt(new Date().toISOString());

  root.up().up();

  root.ele("title").txt(title);

  root.ele("description").txt(description);

  const categoryRoot = root.ele("categories");

  for (const category of categories) {
    //confirm existence of category, if not, add to categories
    categoryRoot.ele("tag").txt(category);
  }

  const tagRoot = root.ele("tags");

  for (const tag of tags) {
    // confirm existence of tag, if not, add to tags
    tagRoot.ele("tag").txt(tag);
  }

  root.ele("favourite").txt("false");

  return root;
}
