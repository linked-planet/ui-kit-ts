import {
	readdirSync,
	readFileSync,
	writeFile,
	existsSync,
	unlinkSync,
} from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",

	fg: {
		black: "\x1b[30m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		magenta: "\x1b[35m",
		cyan: "\x1b[36m",
		white: "\x1b[37m",
		crimson: "\x1b[38m",
	},
	bg: {
		black: "\x1b[40m",
		red: "\x1b[41m",
		green: "\x1b[42m",
		yellow: "\x1b[43m",
		blue: "\x1b[44m",
		magenta: "\x1b[45m",
		cyan: "\x1b[46m",
		white: "\x1b[47m",
		crimson: "\x1b[48m",
	},
}

// __filename and __dirname are not available in ES modules, so we use the following workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const wrapperDirName = resolve(__dirname, "./src/components/showcase/wrapper/")
const outFile = resolve(__dirname, "./public/showcase-sources.txt")

console.log(colors.fg.green, "Copying sources to source file: ", outFile)
console.log(colors.reset)

// check if file exists and delete it
if (existsSync(outFile)) {
	console.log("Deleting existing file: ", outFile)
	unlinkSync(outFile)
}

const content = readdirSync(wrapperDirName)
	.map((fileName) => {
		return readFileSync(
			wrapperDirName + "/" + fileName,
			"utf8",
			function (err, data) {
				return data
			},
		)
	})
	.join("\n")

writeFile(outFile, content, (err) => {
	if (err) {
		console.error(err)
	}
})

console.log(colors.fg.green, "Done")
console.log(colors.reset)
