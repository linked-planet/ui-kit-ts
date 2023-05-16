import { readdirSync, readFileSync, writeFile } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

// __filename and __dirname are not available in ES modules, so we use the following workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const wrapperDirName = resolve(__dirname, "./src/components/showcase/wrapper/")
const outFile = resolve(__dirname, "./public/showcase-sources.txt")

console.log("Showcase Wrapper Directory: ", wrapperDirName)

const content = readdirSync(wrapperDirName)
	.map((fileName) => {
		return readFileSync(
			wrapperDirName + "/" + fileName,
			"utf8",
			function (err, data) {
				return data
			}
		)
	})
	.join("\n")

writeFile(outFile, content, (err) => {
	if (err) {
		console.error(err)
	}
})
