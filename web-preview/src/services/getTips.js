const reg = /error:(.+?)\\n/g; //获取error:xxx到\n间的报错信息
const fs = require("fs");
let path = require("path");
const filepath = "./enhanceTips.json";
let fileStr = fs.readFileSync(path.resolve(__dirname, filepath), "utf-8");
let jsonstr = JSON.parse(fileStr);

const getErrorList = (msg) => {
  if (!msg) return ""; /* 
  console.log("reg:", reg);
  console.log("msg:  ", msg);
  console.log(" msg.match(reg)", String(msg).match(reg)); */
  let allError = [];
  (String(msg).match(reg) || []).forEach((str) => {
    allError.push(
      str
        .toString()
        .replace(/(error: )/g, "")
        .replace(/(\\n)/g, "")
    );
  });

  return allError;
};

export default (msg) => {
  const errorList = getErrorList(msg);
  const firstError = errorList[0];
  console.log("firstError", firstError);
  let tip = undefined;
  jsonstr.data.forEach((item) => {
    if (item.error == firstError) {
      console.log("get!");
      tip = item.tips;
    }
  });
  return tip || "该错误未收集";
};
