/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node test harness. */
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const ts = require("typescript"),
  React = require("react");
const fixture = require("../fixtures/cms-blog.cjs");
const base = "https://cms.example.test/api/v1";
function loader({
  fetchImpl = async () => Response.json(fixture.list([])),
  env = {},
  previewPath,
  cacheImpl = (fn) => fn,
  revalidateTag = () => {},
} = {}) {
  const modules = new Map(),
    requests = [];
  const processStub = {
    env: {
      CMS_API_BASE_URL: base,
      NEXT_PUBLIC_SITE_URL: "https://locatorglobal.com",
      ...env,
    },
  };
  function load(file) {
    file = path.resolve(file);
    if (modules.has(file)) return modules.get(file);
    const exports = {};
    modules.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    const requireLocal = (id) => {
      if (id === "server-only") return {};
      if (id === "node:crypto") return require(id);
      if (id === "next/cache")
        return { unstable_cache: cacheImpl, revalidateTag };
      if (id === "react") return { ...React, cache: (fn) => fn };
      if (id === "react/jsx-runtime") return require(id);
      if (id === "next/image")
        return {
          __esModule: true,
          default: (input) => {
            const props = { ...input };
            delete props.fill;
            delete props.priority;
            return React.createElement("img", props);
          },
        };
      if (id === "next/navigation")
        return {
          notFound: () => {
            throw Error("NEXT_NOT_FOUND");
          },
          usePathname: () => "/qa/about/newsroom",
          useRouter: () => ({
            push: () => {},
            replace: () => {},
            prefetch: () => {},
          }),
        };
      if (id === "next/link")
        return {
          __esModule: true,
          default: (props) => React.createElement("a", props, props.children),
        };
      if (id === "next/server") return { connection: async () => {} };
      if (id.startsWith("@/") || id.startsWith(".")) {
        const abs = id.startsWith("@/")
          ? path.resolve("src", id.slice(2))
          : path.resolve(path.dirname(file), id);
        const target = ["", ".ts", ".tsx", ".js", ".jsx"]
          .map((ext) => abs + ext)
          .find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
        if (!target) throw Error("Missing module " + id);
        return load(target);
      }
      throw Error("Unexpected dependency " + id);
    };
    vm.runInNewContext(
      code,
      {
        exports,
        require: requireLocal,
        process: processStub,
        URL,
        URLSearchParams,
        AbortSignal,
        console,
        Response,
        Buffer,
        Date,
        Set,
        Map,
        fetch: async (...args) => {
          requests.push(args);
          return fetchImpl(...args);
        },
      },
      { filename: file }
    );
    return exports;
  }
  return {
    load,
    requests,
    ...(previewPath ? { preview: load(previewPath) } : {}),
  };
}

module.exports = { loader, base };
