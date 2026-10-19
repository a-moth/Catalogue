// Builds the catalogue page. Replaces the templates in catalogue.xsl.

import { namesFor, type Catalogue, type Entry, type Image } from "./catalogue.ts";
import { formatDate } from "./dates.ts";

// Small helper: create an element with optional class and text.
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: { className?: string; text?: string } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  return element;
}

function renderMetadata(entry: Entry): HTMLParagraphElement {
  const p = el("p");
  p.append(`Created: ${formatDate(entry.metadata.created)}`);

  if (entry.metadata.modified) {
    p.append(el("br"), `Modified: ${formatDate(entry.metadata.modified)}`);
  }

  entry.links.forEach((link, index) => {
    const a = el("a", { text: link.title });
    a.href = link.href;
    p.append(el("br"), `Link (${index + 1}): `, a);
  });

  return p;
}

function renderLabelList(heading: string, names: string[]): HTMLParagraphElement | null {
  if (names.length === 0) return null;

  const p = el("p");
  p.append(heading, el("br"), names.join(", "));
  return p;
}

// Each slide links to its neighbours by fragment ID; the CSS scroll-snap
// container scrolls to whichever slide is targeted.
function renderCarousel(entry: Entry, images: Image[]): HTMLDivElement | null {
  if (images.length === 0) return null;

  const slideId = (index: number) => `slide-${entry.id}-${index + 1}`;
  const wrap = (index: number) => (index + images.length) % images.length;

  const slides = el("div", { className: "slides" });

  images.forEach((image, index) => {
    const figure = el("figure", { className: "slide" });
    figure.id = slideId(index);

    const previous = el("a", { className: "previous", text: "<" });
    previous.href = `#${slideId(wrap(index - 1))}`;
    previous.setAttribute("aria-label", "Previous image");

    const img = el("img", { className: "carousel-image" });
    img.src = image.href;
    img.alt = image.title;
    if (image.width) img.width = image.width;
    if (image.height) img.height = image.height;

    const next = el("a", { className: "next", text: ">" });
    next.href = `#${slideId(wrap(index + 1))}`;
    next.setAttribute("aria-label", "Next image");

    figure.append(previous, img, el("figcaption", { text: image.title }), next);
    slides.append(figure);
  });

  const carousel = el("div", { className: "carousel" });
  carousel.append(slides);
  return carousel;
}

function renderEntry(entry: Entry, catalogue: Catalogue): HTMLElement {
  const article = el("article");
  article.append(el("h2", { text: entry.title }), renderMetadata(entry));

  const body = el("div");
  const parts = [
    renderLabelList("Categories", namesFor(entry.categoryIds, catalogue.categories)),
    renderLabelList("Tags", namesFor(entry.tagIds, catalogue.tags)),
    el("p", { text: entry.description }),
    renderCarousel(entry, entry.images),
  ];
  body.append(...parts.filter((part) => part !== null));

  article.append(body);
  return article;
}

export function renderCatalogue(catalogue: Catalogue, root: HTMLElement): void {
  root.replaceChildren(
    el("h1", { text: "Catalogue" }),
    ...catalogue.entries.map((entry) => renderEntry(entry, catalogue)),
  );
}
