import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

// is we use subpaths and the react router browser router we need to use a fallback solution for subpathes, since when directly used github pages router will try to resolve the path, resulting in a 404
// therefore we copy the index.html to 404.html, and the react router takes over again

// locate the index.html build by vite in dist-showcase
const indexHtmlPath = resolve(__dirname, "../dist-showcase/index.html")
//check if it exists
if (!fs.existsSync(indexHtmlPath)) {
	throw new Error("dist-showcase/index.html not found")
}

const html404Path = resolve(__dirname, "../dist-showcase/404.html")
const htmlIndexPath = resolve(__dirname, "../dist-showcase/index.html")

// copy the index.html to 404.html
fs.copyFileSync(indexHtmlPath, html404Path)
// copy the index.html to index.html
fs.copyFileSync(indexHtmlPath, htmlIndexPath)
