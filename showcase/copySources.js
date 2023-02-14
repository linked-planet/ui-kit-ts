const fs = require("fs")
const dirName = "src/components/showcase/wrapper/"
const outFile = "public/showcase-sources.txt"

const content = fs.readdirSync(dirName).map((fileName) => {
    return fs.readFileSync(dirName + fileName, "utf8", function (err, data) {
        return data;
    })
}).join("\n")

fs.writeFile(outFile, content, (err) => {
    if(err) {
        console.error(err);
    }
})