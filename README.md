# Catalogue

Welcome to the catalogue!

This project is a tool designed to view XML content in a similar way to a Wiki.

The document contains `<entry>` elements with IDs inside an `<entries>` element, which is inside the `<catalog>`.

The document also contains `<tags>` and `<categories>`, which have their according `<tag>` and `<category>` entries.

## Entry
Entry elements contain many elements.
Elements include: metadata, title, tags, categories, description, image, and link.
Not all elements are used by every entry, but it should be expected that there is always metadata, a title, and a description.
Entries missing tags or categories in their elements will be impossible to sort (and won't show up) when filtering the entries by the associated element.

Additionally, these elements have nested data.
### metadata
Metadata contains a `<created>` and a `<modified>` element set.

### tags
Tags contains `<tag>` elements which contain a `<name>` element.

### categories
Categories contains `<category>` element which contain a `<name>` element.

### image
Images are added on their own directly within an entry.
Multiple images are allowed, and they will turn into a carousel at the bottom.
Images contain a `<href>` element.

### link
Links are added on their own directly within an entry.
Multiple links are allowed, and they are shown in a list next to the metadata of the entry.
Links contain a `<href>` element.

## Tag
Tag elements only contain a `<name>` element currently. This could be expanded later to include creation dates of the tags.

## Category
Category elements only contain a `<name>` element currently. This could be expanded later to include creation dates of the categories and a description for the categories.
