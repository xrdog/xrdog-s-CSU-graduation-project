export const func = [
  (item) => {
    if (item.error.match("stray ‘(.+?)’ in program")) {
      item.tips =
        "在代码中打入了全角字符，检查一下是不是某个字符没用英文输入法。\r\n\r\n请检查报错行是否包含了全角的字符。\r\n\r\n\\***并不一定代表了一个具体的字符，它可能是一个全角符号的Unicode值转为了多段ASCII码表示\r\n\r\n如果你想了解此错误产生的更多细节，可以查看:https://stackoverflow.com/questions/19198332/compilation-error-stray-302-in-program-etc";
      item.example.before =
        '#include <stdio.h>\r\nint main ()\r\n{\r\n    printf（"hello world"）;//此处的右括号为中文符号中的右括号\r\n    return 0;\r\n}\r\n';
      item.example.after =
        '#include <stdio.h>\r\nint main ()\r\n{\r\n    printf（"hello world");//将此处的右括号修改为英文符号中的右括号\r\n    //                   ^\r\n    return 0;\r\n}\r\n';
    }
  },
  (item) => {
    if (
      item.error.match(
        "(undeclared)|(was not declared)|(has not been declared)"
      )
    ) {
      if (!item.example.before) {
        item.example.before = `#include<stdio.h>\r\nint a[100];\r\nint main(void)\r\n{\r\n    int n,m,k;\r\n    scanf(\"%d %d %d\",&n,&m,&K);\r\n    //----------------------^//在第6行定义了小写变量k，然而第7行却使用了大写变量K，此报错表示变量K未定义\r\n    memeset(a,0,sizeof(a));\r\n    return 0;  \r\n}`;
      }
      if (!item.example.after) {
        item.example.after = `#include<stdio.h>\r\nint a[100];\r\nint main(void)\r\n{\r\n    int n,m,k;\r\n    scanf(\"%d %d %d\",&n,&m,&k);\r\n    //----------------------^\r\n    memeset(a,0,sizeof(a));\r\n    return 0;  \r\n}`;
      }
      if (item.tips.length === 0) {
        item.tips = "该错误表示报错变量未定义";
      }
    }
  },
  (item) => {
    if (
      item.error.match(
        "(expected (.*) before (.*)|(expected (.*) at end of (.*))|(expected (.*) after (.*)))"
      )
    ) {
      if (!item.example.before) {
        item.example.before = `#include <stdio.h>\r\nint main()\r\n{\r\n    int a,b,k=0,i;\r\n    int c[100];\r\n    while(scanf(\"%d%d\",&a,&b)!=EOF); \r\n\tprintf(\"%d\\n\",a+b);\r\n    return 0;\r\n//缺少了花括号,代码段不闭合`;
      }
      if (!item.example.after) {
        item.example.after = `#include <stdio.h>\r\nint main()\r\n{\r\n    int a,b,k=0,i;\r\n    int c[100];\r\n    while(scanf(\"%d%d\",&a,&b)!=EOF); \r\n\tprintf(\"%d\\n\",a+b);\r\n    return 0;\r\n}`;
      }
      if (item.tips.length === 0) {
        item.tips =
          "请检查报错行表达式是否缺少了对应的标识符，代码段括号是否闭合";
      }
    }
  },
 /*  (item) => {
    if (item.error.match("没有那个文件或目录|No such file or directory")) {
      if (item.tips.length === 0) {
        let reg = /(.+?):/g;
        let name = item.error.match(reg)[0].replace(/:/, "");
        item.tips = `检查头文件是否引用了#include<${name}>,\r\n该错误表示编译器没找到这个库，请检查是否选择了正确的语言及正确的编译器版本进行代码提交。`;
      }
      if (!item.example.before) {
        item.example.before = ;
      }
      if (!item.example.after) {
        item.example.after = `#include <stdio.h>\r\nint main()\r\n{\r\n    int a,b,k=0,i;\r\n    int c[100];\r\n    while(scanf(\"%d%d\",&a,&b)!=EOF); \r\n\tprintf(\"%d\\n\",a+b);\r\n    return 0;\r\n}`;
      }
    }
  }, */
];
