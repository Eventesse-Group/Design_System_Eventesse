import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const declarations = [...css.matchAll(/(--eds-[\w-]+)\s*:/g)].map((match) => match[1]);
const unique = new Set(declarations);
const required = ["--eds-background-canvas", "--eds-content-primary", "--eds-border-focus", "--eds-font-family-sans", "--eds-space-4", "--eds-radius-md"];
const missing = required.filter((token) => !unique.has(token));

if (missing.length) {
  throw new Error(`Tokens obrigatórios ausentes: ${missing.join(", ")}`);
}

console.log(`Tokens validados: ${unique.size} nomes únicos.`);
