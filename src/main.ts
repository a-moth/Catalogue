import data from "../catalogue.json";
import type { Catalogue } from "./catalogue.ts";
import { renderCatalogue } from "./render.ts";
import "../index.css";

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app element in index.html");

renderCatalogue(data as Catalogue, root);
