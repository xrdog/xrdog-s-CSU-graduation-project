const fs = require("fs");
let path = require("path");
import { highFrequencyErrors } from "./highFrequencyErrors.js";
const filepath = "../resource/all_error_message.json";
let fileStr = fs.readFileSync(path.resolve(__dirname, filepath), "utf-8");

let jsonstr = JSON.parse(fileStr);
let allError = [],
  errors = [],
  count_err = 0;
const reg = /error:(.+?)\n/g; //获取error:xxx到\n间的报错信息

let getPercent = (x) => {
  return `${((x / errorSize) * 100).toFixed(2)}%`;
};

jsonstr.data.forEach((item) => {
  (item.error.match(reg) || []).forEach((str,key) => {
    //if (key>0) return ;//统计首条错误信息
    allError.push(
      str
        .toString()
        .replace(/(error: )/g, "")
        .replace(/(\n)/g, "")
    );
  });
});

const errorSize = allError.length;
//console.log('errorSize',jsonstr.data.length)
allError.sort();
let errMap = new Map(),
  highFrequencyErrorsMap = new Map(), //记录每个reg的匹配次数
  highFrequencyErrorsArr = new Map(), //记录每个reg所匹配的词条
  errorExiested = new Map(); //
allError.forEach((err) => {
  if (!errMap.get(err)) errors.push(err);
  errMap.set(err, (errMap.get(err) || 0) + 1);
});

let result = {},
  resultWithDeduplication = {};
(result.data = []), (resultWithDeduplication.data = []);
errors.forEach((item) => {
  result.data.push({
    error: item,
    times: errMap.get(item),
    percent: getPercent(errMap.get(item)),
    tips: "",
    example: {
      before: "",
      after: "",
    },
  });
});

result.data.sort((a, b) => b.times - a.times);
result.data.forEach((item) => {
  item.uid = ++count_err;
});

fs.writeFile(
  path.resolve(__dirname, "../product/errorsWithtips.json"),
  JSON.stringify(result, null, "\t"),
  (err) => console.log("fs_write_error: ", err)
);

result.data.forEach((item) => {
  if (
    !highFrequencyErrors.some((reg) => {
      if (item.error.match(reg)) {
        if (!errorExiested.get(item.error)) {
          errorExiested.set(item.error, true);
          if (!highFrequencyErrorsArr.get(reg))
            highFrequencyErrorsArr.set(reg, []);
          highFrequencyErrorsArr.get(reg).push({
            error: item.error,
            times: item.times,
            percent: getPercent(item.times),
            uid: item.uid,
          });
          highFrequencyErrorsMap.set(
            reg,
            (highFrequencyErrorsMap.get(reg) || 0) + item.times
          );
        }
        return true;
      }
    })
  ) {
    resultWithDeduplication.data.push(item);
  }
});

highFrequencyErrors.forEach((item) => {
  resultWithDeduplication.data.push({
    error: item,
    times: highFrequencyErrorsMap.get(item),
    percent: getPercent(highFrequencyErrorsMap.get(item)),
    errors: highFrequencyErrorsArr.get(item),
  });
});

resultWithDeduplication.data.sort((a, b) => b.times - a.times);

fs.writeFile(
  path.resolve(__dirname, "../product/errorsWithDeduplication.json"),
  JSON.stringify(resultWithDeduplication, null, "\t"),
  (err) => console.log("fs_write_error: ", err)
);

console.log("errorSize:", errorSize);
