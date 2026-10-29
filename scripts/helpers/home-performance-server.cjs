/* eslint-disable @typescript-eslint/no-require-imports -- Local Node verification fixtures. */
// Local performance fixture: synthetic CMS, disabled delivery, external-blocking proxy.
const fs = require("fs"),
  http = require("http"),
  { spawn } = require("child_process");
const out = ".verification/home-performance";
let child;
fs.mkdirSync(out, { recursive: true });
const api = http.createServer((req, res) => {
  const u = new URL(req.url, "http://local");
  const limit = Number(u.searchParams.get("limit") || 12),
    page = Number(u.searchParams.get("page") || 1);
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      success: true,
      items: [],
      pagination: { page, limit, total: 0, pages: 0 },
    })
  );
});
const listen = (s) =>
  new Promise((r) => s.listen(0, "127.0.0.1", () => r(s.address().port)));
(async () => {
  const apiPort = await listen(api);
  const reservation = http.createServer();
  const port = await listen(reservation);
  await new Promise((r) => reservation.close(r));
  const origin = "http://127.0.0.1:" + port;
  const blocked = [];
  const proxy = http.createServer((req, res) => {
    let u;
    try {
      u = new URL(req.url);
    } catch {
      res.writeHead(400);
      return res.end();
    }
    if (u.origin !== origin) {
      blocked.push(u.hostname);
      res.writeHead(403);
      return res.end("External services blocked in local measurements");
    }
    const upstream = http.request(
      u,
      { method: req.method, headers: req.headers },
      (response) => {
        res.writeHead(response.statusCode, response.headers);
        response.pipe(res);
      }
    );
    upstream.on("error", () => {
      res.writeHead(502);
      res.end();
    });
    req.pipe(upstream);
  });
  proxy.on("connect", (req, socket) => {
    blocked.push(req.url.split(":")[0]);
    socket.end("HTTP/1.1 403 Forbidden\r\n\r\n");
  });
  const proxyPort = await listen(proxy);
  fs.writeFileSync(
    out + "/endpoints.json",
    JSON.stringify({ origin, port, apiPort, proxyPort }, null, 2)
  );
  const log = fs.createWriteStream(out + "/server.log", { flags: "a" });
  child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    {
      windowsHide: true,
      env: {
        ...process.env,
        CMS_API_BASE_URL: "http://127.0.0.1:" + apiPort + "/api/v1",
        SITE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "https://locatorglobal.com",
        TURNSTILE_SECRET_KEY: "",
        MAIL_HOST: "",
        MAIL_PASSWORD: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  child.on("exit", () => {
    fs.writeFileSync(
      out + "/blocked-hosts.json",
      JSON.stringify([...new Set(blocked)])
    );
    api.close();
    proxy.close();
    process.exit();
  });
  console.log(JSON.stringify({ origin, proxyPort }));
  const stop = () => {
    if (child) child.kill();
    api.close();
    proxy.close();
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
})();
