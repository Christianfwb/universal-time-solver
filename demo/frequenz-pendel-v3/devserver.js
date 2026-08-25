// devserver.js — nur node:http/node:fs. Kein npm-Paket, kein Download. D005.
// Routet /concepts/* auf die Repository-Wurzel (read-only), alles andere auf HERE.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const TYPES = { ".html": "text/html", ".js": "text/javascript",
  ".json": "application/json", ".css": "text/css", ".png": "image/png" };

createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file;
    if (urlPath.startsWith("/concepts/")) {
      file = path.resolve(ROOT, "." + urlPath);
      if (!file.startsWith(path.join(ROOT, "concepts"))) throw new Error("traversal");
    } else {
      file = path.resolve(HERE, "." + (urlPath === "/" ? "/index.html" : urlPath));
      if (!file.startsWith(HERE)) throw new Error("traversal");
    }
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404); res.end("not found");
  }
}).listen(8080, () => console.log("devserver: http://localhost:8080"));
