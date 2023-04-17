import { readdirSync, readFileSync, writeFile } from "fs";
const dirName = "./src/components/showcase/wrapper/";
const outFile = "./public/showcase-sources.txt";

const content = readdirSync(dirName)
  .map((fileName) => {
    return readFileSync(dirName + fileName, "utf8", function (err, data) {
      return data;
    });
  })
  .join("\n");

writeFile(outFile, content, (err) => {
  if (err) {
    console.error(err);
  }
});
