const fs = require("fs");
let path = require("path");
import { func } from "./func";
const filepath = "./errorsWithtips.json";
let fileStr = fs.readFileSync(path.resolve(__dirname, filepath), "utf-8");
console.log('psth',path.resolve(__dirname, filepath))
let jsonstr = JSON.parse(fileStr);

jsonstr.data.forEach((item) => {
  func.forEach((F) => {
    F(item);
  });
});

fs.writeFile(
  path.resolve(__dirname, "../enhanceTips.json"),
  JSON.stringify(jsonstr, null, "\t"),
  (err) => console.log("fs_write_error: ", err)
);
