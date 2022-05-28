const reg = /error:(.+?)\r/g; //获取error:xxx到\r间的报错信息
const fs = require("fs");
let path = require("path");
const filepath = "./enhanceTips.json";
let fileStr = fs.readFileSync(path.resolve(__dirname, filepath), "utf-8");
let jsonstr = JSON.parse(fileStr);
var exec = require("child_process").exec;

//监听进程未处理rejection
process.on("unhandledRejection", (reason, p) => {
  console.log("catch by unhandledRejection!!!!!");
  console.log("catch by unhandledRejection!!!!!");
  console.log("catch by unhandledRejection!!!!!");
  console.log("Promise: ", p, "Reason: ", reason);
});

const getErrorList = (msg) => {
  if (!msg) return "";
  let allError = [];
  (msg.match(reg) || []).forEach((str) => {
    allError.push(
      str
        .toString()
        .replace(/(error: )/g, "")
        .replace(/(\r)/g, "")
    );
  });

  return allError;
};

//获取错误的报错行
const getErrorLine = (msg) => {
  return (msg.match(/:(\d):/g) || [""])[0].replace(/:/g, "");
};

//简单错误处理逻辑
const defaultGetTips = async (errorList) => {
  const firstError = errorList[0];
  console.log("firstError", JSON.stringify(firstError));
  if (!Array.isArray(errorList)) return Promise.resolve("错误解析失败");
  let tip = undefined;
  jsonstr.data.forEach((item) => {
    //将符号‘’转换为''
    const compatibleStr = item.error.replace(/‘/g, "'").replace(/’/g, "'");
    if (firstError == compatibleStr) {
      console.log("get!", item.tips);
      tip = item;
    }
  });
  if (tip === undefined)
    return new Promise((resolve) => {
      resolve({ tips: "该错误未收录" });
    });
  return Promise.resolve(tip);
};

//复杂错误处理逻辑
const getComplexErrorTips = async (errorList) => {
  const firstError = errorList[0];
  
  return undefined;
};

//获取编译器报错信息
const compileCPP = async (msg) => {
  const { sourceCode } = msg;
  console.log("code", sourceCode);
  fs.writeFile(path.resolve(__dirname, "./source_code.c"), sourceCode, (err) =>
    console.log("fs_write_error: ", err)
  );
  return new Promise(function (resolve, reject) {
    var cmd = `gcc source_code.c`;
    exec(
      cmd,
      {
        maxBuffer: 1024 * 2000,
        cwd: __dirname,
      },
      function (err, stdout, stderr) {
        if (err) {
          //console.log(err);
          resolve(stderr);
        } else if (stderr.length > 0) {
          resolve(new Error(stderr.toString()));
        } else {
          //console.log(stdout);
          resolve("noError");
        }
      }
    );
  });
};

//处理type=1,直接提交CPP源码的情况
const workSourceCode = async (msg) => {
  const compileErrMessage = await compileCPP(msg);
  console.log("compileErrMessage", compileErrMessage);
  if (compileErrMessage === "noError") {
    return Promise.resolve({ tips: "该代码无编译错误" });
  }
  const errorList = getErrorList(compileErrMessage);
  console.log("errorlist", errorList);
  let tip = await getComplexErrorTips(errorList);
  if (!tip) {
    tip = await defaultGetTips(errorList);
  }
  return Promise.resolve(
    Object.assign(tip, {
      gccResponse: compileErrMessage,
      line: getErrorLine(compileErrMessage),
    })
  );
};

//处理type=2,直接提交编译错误反馈信息的情况
const workCompileMessage = (msg) => {
  const errorList = getErrorList(msg.compileErrMessage);
  let tip = defaultGetTips(errorList);
  return tip;
};

export default async (msg) => {
  if (msg.type === 1) {
    return workSourceCode(msg);
  }
  if (msg.type === 2) {
    return Promise.resolve(workCompileMessage(msg));
  }
  return "error_code=0";
};
