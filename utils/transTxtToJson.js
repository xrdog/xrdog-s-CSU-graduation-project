const fs = require("fs");
const path = require("path");
const name = process.argv.slice(2)[0];
const env = process.env;
console.log("name", name);

console.log("process", env.INIT_CWD);
fs.readFile(`${env.INIT_CWD}/${name}.txt`, "utf-8", (err, data) => {
  if (err) {
    console.log("err:", err);
    throw err;
  }
  console.log("data", data);

  fs.writeFile(`${env.INIT_CWD}/${name}.json`, JSON.stringify(data, null, "\t"), (err) =>
    console.log("fs_write_error: ", err)
  );
});
