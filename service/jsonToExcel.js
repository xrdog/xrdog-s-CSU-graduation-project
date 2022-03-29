//将errorsWithDeduplication.json转为errorsWithDeduplication.xls
const fs = require("fs");
const path=require('path')
const json2xls = require("json2xls");
fs.readFile(path.resolve(__dirname,"../product/errorsWithDeduplication.json"), "utf-8", (err, data) => {
  if (err) {
    console.log("err:", err);
    throw err;
  }
  const json = JSON.parse(data);
  let arr = [];
  json.data.forEach((item) => {
    let temp = {
      error: item.error,
      time: item.times,
      percent: item.percent,
    };
    arr.push(temp);
  });
  let xls = json2xls(json.data);
  fs.writeFileSync(path.resolve(__dirname,"./product/errorsWithDeduplication.xlsx"), xls, "binary");
});
