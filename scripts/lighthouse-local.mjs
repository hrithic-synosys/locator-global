// Manual local benchmark. All external services are blocked by the fixture proxy.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const tools = path.resolve(
  process.env.PERFORMANCE_TOOLS_DIR ||
    ".verification/performance-tools/node_modules"
);
const { default: lighthouse } = await import(
  pathToFileURL(path.join(tools, "lighthouse/core/index.js"))
);
const { launch } = await import(
  pathToFileURL(path.join(tools, "chrome-launcher/dist/index.js"))
);
const { origin, proxyPort } = JSON.parse(
  fs.readFileSync(path.resolve(".verification/home-performance/endpoints.json"))
);
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin))
  throw Error("Local fixture origin required");
const phase = process.argv[2] || "after";
if (!["before", "after"].includes(phase)) throw Error("Choose before or after");
const output = pathToFileURL(
  path.resolve(".verification/home-performance") + path.sep
);
const summaries = [];
for (const mode of ["mobile", "desktop"])
  for (let run = 1; run <= 2; run++) {
    const mobile = mode === "mobile";
    const settings = {
      onlyCategories: ["performance"],
      formFactor: mode,
      screenEmulation: {
        mobile,
        width: mobile ? 390 : 1440,
        height: mobile ? 844 : 900,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttlingMethod: "simulate",
      throttling: {
        rttMs: mobile ? 150 : 40,
        throughputKbps: mobile ? 1638.4 : 10240,
        cpuSlowdownMultiplier: mobile ? 4 : 1,
      },
      maxWaitForLoad: 45000,
    };
    const chrome = await launch({
      chromePath:
        process.env.CHROME_PATH ||
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
      chromeFlags: [
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--proxy-server=http://127.0.0.1:" + proxyPort,
        "--proxy-bypass-list=<-loopback>",
      ],
    });
    try {
      const result = await lighthouse(
        origin,
        { port: chrome.port, output: "json", logLevel: "error" },
        { extends: "lighthouse:default", settings }
      );
      const report = result.lhr;
      if (report.runtimeError) throw Error(report.runtimeError.message);
      if (
        report.configSettings.formFactor !== mode ||
        report.configSettings.screenEmulation.width !==
          settings.screenEmulation.width
      )
        throw Error("Wrong Lighthouse device configuration");
      fs.writeFileSync(
        new URL(phase + "-" + mode + "-" + run + ".json", output),
        result.report
      );
      const metrics = {
        phase,
        mode,
        run,
        score: Math.round(report.categories.performance.score * 100),
        fcp: report.audits["first-contentful-paint"].numericValue,
        lcp: report.audits["largest-contentful-paint"].numericValue,
        tbt: report.audits["total-blocking-time"].numericValue,
        cls: report.audits["cumulative-layout-shift"].numericValue,
        speedIndex: report.audits["speed-index"].numericValue,
      };
      summaries.push(metrics);
      console.log(JSON.stringify(metrics));
    } finally {
      await chrome.kill();
    }
  }
fs.writeFileSync(
  new URL(phase + "-summary.json", output),
  JSON.stringify(summaries, null, 2)
);
