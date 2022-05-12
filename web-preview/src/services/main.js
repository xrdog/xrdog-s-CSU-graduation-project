import Koa from "koa";
const app = new Koa();
const koaBody = require("koa-body");
import getTips from "./getTips";

app.use(koaBody());

app.use(async (ctx) => {
  if (ctx.request.path === "/api") {
    console.log("do");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT , POST");
    ctx.set("Access-Control-Allow-Headers", "*");
    ctx.response.type = "json";
    ctx.response.body = {
      data: {
        tips: getTips(ctx.request.body),
      },
    };
  }
});

app.listen(7777);
console.log("app started at port 7777...");
