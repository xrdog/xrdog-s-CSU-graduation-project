import Koa from "koa";
const app = new Koa();
const koaBody = require("koa-body");
import getTips from './getTips'

app.use(koaBody());

const reg = /error:(.+?)\\n/g; //获取error:xxx到\n间的报错信息


app.use(async (ctx) => {
  //console.log("ctx.request:   ", ctx.request);
  if (ctx.request.path === "/api") {
    console.log("do");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT , POST");
    ctx.set("Access-Control-Allow-Headers", "*");
    ctx.response.type = "json";
    ctx.response.body = {
      data: {
        tips: getTips(ctx.request.body.compileErrMessage),
      },
    };
  }
});

app.listen(7777);
console.log("app started at port 7777...");
