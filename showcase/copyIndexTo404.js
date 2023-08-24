import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

// is we use subpaths and the react router browser router we need to use a fallback solution for subpathes, since when directly used github pages router will try to resolve the path, resulting in a 404
// therefore we copy the index.html to 404.html, and the react router takes over again

// locate the index.html build by vite in dist-showcase
const indexHtmlPath = path.resolve(__dirname, "../dist-showcase/index.html")
//check if it exists
if (!fs.existsSync(indexHtmlPath)) {
	throw new Error("dist-showcase/index.html not found")
}

const html404Path = path.resolve(__dirname, "../dist-showcase/404.html")

// copy the index.html to 404.html
fs.copyFileSync(indexHtmlPath, html404Path)
