# Catalogue

Welcome to the catalogue!

This project is a tool designed to view catalogue content in a similar way to a Wiki.

The content lives in `catalogue.json`, which is strictly defined by `catalogue.schema.json` ([JSON Schema](https://json-schema.org/)).
VS Code checks the file against the schema as you edit it.

## Commands
| Command | What it does |
|---|---|
| `npm run dev` | Starts the site locally |
| `npm run add -- …` | Adds an entry (see [Adding an entry](#adding-an-entry)) |
| `npm run sync` | Registers new tags and categories, then validates the catalogue |
| `npm run typecheck` | Checks the TypeScript |

## Document structure
The document contains `schemaVersion`, `tags`, `categories` and `entries`.
Unknown fields are rejected everywhere.

```json
{
  "$schema": "./catalogue.schema.json",
  "schemaVersion": 1,
  "tags": [{ "id": "coping-skills", "name": "coping skills" }],
  "categories": [{ "id": "adhd", "name": "ADHD" }],
  "entries": [ … ]
}
```

## Entry
Every entry contains all of these fields; lists may be empty.

| Field | Type | Notes |
|---|---|---|
| `id` | string | A UUID for new entries |
| `metadata.created` | date-time | ISO 8601, e.g. `2026-07-27T13:00:00Z` |
| `metadata.modified` | date-time or `null` | |
| `title` | string | Not blank |
| `description` | string | Not blank |
| `tagIds` | tag IDs | No duplicates |
| `categoryIds` | category IDs | No duplicates |
| `images` | image list | Shown as a carousel |
| `links` | link list | Shown next to the metadata |
| `favourite` | boolean | |

Entries without tags or categories won't show up when filtering by them.

### image
Contains a `title` and an `href` (URI), and optionally a `width` and `height` in pixels.

### link
Contains a `title` and an `href` (URI).

## Tag and Category
Tags and categories contain an `id` and a `name`.

- The `id` is a lowercase slug, e.g. `coping-skills`. Entries refer to tags and categories by ID.
- The `name` is what's displayed. It can be changed freely; the ID stays the same.

Using a new tag or category ID in an entry creates it automatically (via `npm run add` or `npm run sync`), with a name generated from the ID (`coping-skills` → `coping skills`).
Each new one is reported, e.g. `➕ New tag created: energy`, so typos are easy to spot.

## Adding an entry
```bash
npm run add -- --title "Spoon theory" \
  --description "A way to describe limited energy." \
  --tag coping-skills --tag energy \
  --category adhd \
  --link "Original essay|https://example.com" \
  --image "Diagram|https://example.com/diagram.png" \
  --favourite
```

`--title` and `--description` are required. `--tag`, `--category`, `--link` and `--image` can be repeated.
The catalogue is only saved if the result is valid.

You can also edit `catalogue.json` by hand, then run `npm run sync`.

## Project layout
| Path | Purpose |
|---|---|
| `catalogue.json` | The data |
| `catalogue.schema.json` | The formal rules for the data |
| `src/catalogue.ts` | TypeScript types and tag/category logic |
| `src/entries.ts` | `createEntry()` |
| `src/render.ts` | Builds the page |
| `scripts/` | The `add` and `sync` commands |
