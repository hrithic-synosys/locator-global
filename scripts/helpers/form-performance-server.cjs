/* eslint-disable @typescript-eslint/no-require-imports -- Local Node verification fixtures. */
// Local synthetic form server only. Never use this launcher for deployment.
const fs = require("fs"),
  path = require("path"),
  net = require("net"),
  http = require("http"),
  { spawn } = require("child_process");
const root = path.resolve(".verification/home-performance"),
  control = path.join(root, "form-control.json");
fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(control, JSON.stringify({ provider: "pass", mail: "pass" }));
let accepted = 0,
  attempts = 0;
const listen = (s) =>
  new Promise((r) => s.listen(0, "127.0.0.1", () => r(s.address().port)));
(async () => {
  const smtp = net.createServer((socket) => {
    socket.setEncoding("utf8");
    socket.write("220 local-fixture ESMTP\r\n");
    let buffer = "",
      data = false;
    socket.on("data", (chunk) => {
      buffer += chunk;
      while (buffer.includes("\n")) {
        const i = buffer.indexOf("\n"),
          line = buffer.slice(0, i + 1).replace(/\r?\n$/, "");
        buffer = buffer.slice(i + 1);
        if (data) {
          if (line !== ".") continue;
          data = false;
          attempts++;
          if (JSON.parse(fs.readFileSync(control)).mail === "fail")
            socket.write("451 Mock delivery unavailable\r\n");
          else {
            accepted++;
            socket.write("250 Queued locally\r\n");
          }
          continue;
        }
        if (/^EHLO|^HELO/i.test(line))
          socket.write("250-local-fixture\r\n250 AUTH PLAIN\r\n");
        else if (/^AUTH/i.test(line)) socket.write("235 Authenticated\r\n");
        else if (/^DATA/i.test(line)) {
          data = true;
          socket.write("354 End with dot\r\n");
        } else if (/^QUIT/i.test(line)) {
          socket.end("221 Bye\r\n");
        } else socket.write("250 OK\r\n");
      }
    });
  });
  const smtpPort = await listen(smtp);
  const api = http.createServer((req, res) => {
    if (req.url === "/stats") {
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ accepted, attempts }));
    }
    if (req.url === "/mode" && req.method === "POST") {
      let body = "";
      req.on("data", (b) => (body += b));
      req.on("end", () => {
        fs.writeFileSync(control, body);
        res.end("ok");
      });
      return;
    }
    const u = new URL(req.url, "http://fixture"),
      page = Number(u.searchParams.get("page") || 1),
      limit = Number(u.searchParams.get("limit") || 12);
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        items: [],
        pagination: { page, limit, total: 0, pages: 0 },
      })
    );
  });
  const apiPort = await listen(api);
  const reservation = http.createServer();
  const port = await listen(reservation);
  await new Promise((r) => reservation.close(r));
  const origin = "http://127.0.0.1:" + port;
  fs.writeFileSync(
    path.join(root, "form-endpoints.json"),
    JSON.stringify({ origin, controlOrigin: "http://127.0.0.1:" + apiPort })
  );
  const log = fs.createWriteStream(path.join(root, "form-server.log"));
  const child = spawn(
    process.execPath,
    [
      "--require",
      path.resolve(__dirname, "form-siteverify-preload.cjs"),
      "node_modules/next/dist/bin/next",
      "start",
      "-p",
      String(port),
    ],
    {
      windowsHide: true,
      env: {
        ...process.env,
        LOCATOR_LOCAL_FORM_FIXTURE: "true",
        LOCATOR_TEST_CONTROL: control,
        CMS_API_BASE_URL: "http://127.0.0.1:" + apiPort + "/api/v1",
        SITE_ENV: "development",
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "browser-test-site-key",
        TURNSTILE_SECRET_KEY: "private-fixture",
        TURNSTILE_ALLOWED_HOSTNAMES: "localhost,127.0.0.1",
        MAIL_HOST: "127.0.0.1",
        MAIL_PORT: String(smtpPort),
        MAIL_USERNAME: "fixture",
        MAIL_PASSWORD: "fixture",
        MAIL_FROM: "forms@example.invalid",
        CONTACT_RECIPIENT_EMAIL: "test@example.invalid",
        QUOTE_RECIPIENT_EMAIL: "test@example.invalid",
        CAREER_RECIPIENT_EMAIL: "test@example.invalid",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  child.on("exit", () => {
    smtp.close();
    api.close();
    process.exit();
  });
  process.on("SIGINT", () => child.kill());
  process.on("SIGTERM", () => child.kill());
  console.log(
    JSON.stringify({ origin, controlOrigin: "http://127.0.0.1:" + apiPort })
  );
})();
