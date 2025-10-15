import path from "node:path";
import { main } from "../src";

const fixturesRoot = path.resolve(__dirname, "../__tests__/__fixtures__");

const keepachangelog = path.join(fixturesRoot, "keepachangelog.md");
const astro = path.join(fixturesRoot, "astro.md");
const vitepress = path.join(fixturesRoot, "vitepress.md");

describe("main()", () => {
  it("应解析更改日志文件", async () => {
    const result = await main({ filename: keepachangelog });

    expect(result).toMatchSnapshot();
  });

  it("非对象选项会空对象合并配置，会自动找filename，找不到会抛出异常", async () => {
    await expect(
      // @ts-expect-error 故意传入错误的选项
      main(undefined),
    ).rejects.toThrow();
  });

  it("返回指定的版本", async () => {
    const result = await main({ filename: keepachangelog, version: "1.0.0" });

    expect(result).toMatchSnapshot();
  });

  it("返回指定的版本同时携带标题", async () => {
    const result = await main({
      filename: keepachangelog,
      version: "1.0.0",
      withTitle: true,
    });
    expect(result).toMatchSnapshot();
  });

  it("没找到版本时应抛出异常", async () => {
    await expect(
      main({ filename: keepachangelog, version: "999.0.0" }),
    ).rejects.toThrow("Version not found: 999.0.0");
  });

  it("当latest=true时，应返回最新版本", async () => {
    const result = await main({ filename: keepachangelog, latest: true });
    expect(result).toMatchSnapshot();
  });

  it("当 latest = true 且 withTitle = true 时，应拼接标题与内容", async () => {
    const result = await main({
      filename: keepachangelog,
      latest: true,
      withTitle: true,
    });

    expect(result).toMatchSnapshot();
  });

  it("当 tag 为 h1 时，使用单个 # 前缀", async () => {
    const result = await main({
      filename: vitepress,
      version: "1.6.0",
      withTitle: true,
    });

    expect(result).toMatchSnapshot();
  });
});
