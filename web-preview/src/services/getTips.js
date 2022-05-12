const reg = /error:(.+?)\n/g; //获取error:xxx到\n间的报错信息
const fs = require("fs");
let path = require("path");
const filepath = "./enhanceTips.json";
let fileStr = fs.readFileSync(path.resolve(__dirname, filepath), "utf-8");
let jsonstr = JSON.parse(fileStr);
var exec = require("child_process").exec;
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

//获取编译器报错信息
const compileCPP = async () => {
  return new Promise(function (resolve, reject) {
    var cmd = "dir";
    exec(
      cmd,
      {
        maxBuffer: 1024 * 2000,
        cwd: __dirname,
      },
      function (err, stdout, stderr) {
        if (err) {
          console.log(err);
          reject(err);
        } else if (stderr.length > 0) {
          reject(new Error(stderr.toString()));
        } else {
          console.log(stdout);
          resolve();
        }
      }
    );
  });
};

//处理type=1,直接提交CPP源码的情况
const workSourceCode = async (msg) => {
  const { sourceCode } = msg;
  console.log("code", sourceCode);
  const compileErrMessage = await compileCPP();
  return "xxx";
};

//处理type=2,直接提交编译错误反馈信息的情况
const workCompileMessage = (msg) => {
  const errorList = getErrorList(msg.compileErrMessage);
  let tip = defaultGetTips(errorList);
  return tip || "该错误未收集";
};

export default (msg) => {
  if (msg.type === 1) {
    return workSourceCode(msg);
  }
  if (msg.type === 2) {
    return workCompileMessage(msg);
  }
  return "error_code=0";
};
