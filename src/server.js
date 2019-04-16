const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const Static = require("koa-static");
const ReactDOMServer = require("react-dom/server");
const app = new Koa();
const router = new Router();
let serverEntry;
let template;
(async () => {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
        serverEntry = require("../dist/entry-server");
        template = fs.readFileSync("./dist/index.html", "utf-8");
        // 静态资源映射到dist路径下
        app.use(Static(path.join(__dirname, "../dist")));
    } else {
        // 非生产环境使用webpack - dev - middleware和webpack - hot - middleware进行热更新
        await require("./setup-dev-server")(app, (entry, htmlTemplate) => {
            serverEntry = entry;
            template = htmlTemplate;
        });
    }
    /* eslint-disable no-console */
    const render = async (ctx, next) => {
        console.log("visit url: " + ctx.url);
        let html = ReactDOMServer.renderToString(serverEntry);
        let htmlStr = template.replace("<!--react-ssr-outlet-->", `${html}`);
        // 将渲染后的html字符串发送给客户端
        ctx.body = htmlStr;
    }
    router.get('/home', render)
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(3000, () => {
        console.log("Your app is running");
    });
})()