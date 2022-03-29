const fs = require("fs");
const path = require("path");
const name = process.argv.slice(2)[0];
console.log("name", name);
fs.readFile(`${name}.txt`, "utf-8", (err, data) => {
  if (err) {
    console.log("err:", err);
    throw err;
  }
  console.log("data", data);

  fs.writeFile(`${name}.json`, JSON.stringify(data, null, "\t"), (err) =>
    console.log("fs_write_error: ", err)
  );
});
