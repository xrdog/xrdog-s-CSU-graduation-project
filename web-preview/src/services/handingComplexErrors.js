export default [
  {
    msgReg: "",
    handlingFuc: () => {
      return {
        times: 0,
        tips: "1. 某一个函数或者变量没有在使用之前声明。检查报错行的函数与变量即可。\r\n\r\n2.某处括号不匹配。并不一定是报错行缺少或者多余了括号，请检查报错行所在的整个代码段。",
        example: {
          before: "",
          after: "",
        },
        line: [],
      };
    },
  },
];
