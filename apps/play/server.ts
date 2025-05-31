import html from "./index.html";

const server = Bun.serve({
  development: {
    hmr: true,
    console: true,
  },
  // 设置静态文件目录

  routes: {
    "/": html,
  },
});
console.log(`Listening on ${server.url}`);
