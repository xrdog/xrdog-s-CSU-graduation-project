const reg = /error:(.+?)\n/g; //获取error:xxx到\n间的报错信息
const fs = require("fs");
let path = require("path");
const filepath = "./enhanceTips.json";
let fileStr = fs.readFileSync(path.resolve(__dirname, filepath), "utf-8");
let jsonstr = JSON.parse(fileStr);

const getErrorList = (msg) => {
  if (!msg) return "";
  let allError = [];
  (String(msg).match(reg) || []).forEach((str) => {
    allError.push(
      str
        .toString()
        .replace(/(error: )/g, "")
        .replace(/(\n)/g, "")
    );
  });

  return allError;
};

//简单错误处理逻辑
const defaultGetTips = (errorList) => {
  const firstError = errorList[0];
  console.log("firstError", firstError);
  if (!Array.isArray(errorList)) return "错误解析失败";
  let tip = undefined;
  jsonstr.data.forEach((item) => {
    if (item.error == firstError) {
      console.log("get!", item.tips);
      tip = item.tips;
    }
  });
  return tip;
};

export default (msg) => {
  const errorList = getErrorList(msg);
  let tip = defaultGetTips(errorList);
  return tip || "该错误未收集";
};
