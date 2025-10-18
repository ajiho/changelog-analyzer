import path from "node:path"
import { main } from "../src"

const fixturesDir = path.resolve(__dirname, "../../../__fixtures__")
const testfile = path.join(fixturesDir, "test.md")
const vitepress = path.join(fixturesDir, "vitepress.md")

const testfileParsed = {
  title: "changelog title",
  description: "A cool description (optional).",
  versions: [
    {
      version: null,
      tag: "h2",
      title: "unreleased",
      date: null,
      body: "- foo",
      parsed: { _: ["- foo"] },
    },
    {
      version: "x.y.z",
      tag: "h2",
      title: "x.y.z - YYYY-MM-DD (or DD.MM.YYYY, D/M/YY, etc.)",
      date: null,
      body: "- bar",
      parsed: { _: ["- bar"] },
    },
    {
      version: "a.b.c",
      tag: "h2",
      title: "[a.b.c]",
      date: null,
      body: "### Changes\n\n- Update API\n- Fix bug #1",
      parsed: {
        _: ["- Update API", "- Fix bug #1"],
        Changes: ["- Update API", "- Fix bug #1"],
      },
    },
    {
      version: "2.2.3-pre.1",
      tag: "h2",
      title: "2.2.3-pre.1 - 2013-02-14",
      date: "2013-02-14",
      body: "- Update API",
      parsed: { _: ["- Update API"] },
    },
    {
      version: "2.0.0-x.7.z.92",
      tag: "h2",
      title: "2.0.0-x.7.z.92 - 2013-02-14",
      date: "2013-02-14",
      body: "- bark bark\n- woof\n- arf",
      parsed: { _: ["- bark bark", "- woof", "- arf"] },
    },
    {
      version: "1.3.0",
      tag: "h2",
      title: "v1.3.0",
      date: null,
      body: "- make it so",
      parsed: { _: ["- make it so"] },
    },
    {
      version: "1.2.3",
      tag: "h2",
      title: "[1.2.3](link)",
      date: null,
      body: "- init",
      parsed: { _: ["- init"] },
    },
  ],
}

describe("main()", () => {
  it("应解析更改日志文件", async () => {
    const result = await main({ filename: testfile })

    // console.dir(JSON.parse(result), { depth: null })

    expect(JSON.parse(result)).toStrictEqual(testfileParsed)
  })

  it("非对象选项会空对象合并配置，会自动找filename，找不到会抛出异常", async () => {
    await expect(
      // @ts-expect-error 故意传入错误的选项
      main(undefined),
    ).rejects.toThrow()
  })

  it("返回指定的版本", async () => {
    const result = await main({ filename: testfile, version: "1.3.0" })

    expect(result).toBe(`- make it so`)
  })

  it("返回指定的版本同时携带标题", async () => {
    const result = await main({
      filename: testfile,
      version: "1.3.0",
      withTitle: true,
    })

    expect(result).toBe(`## v1.3.0\r\n\r\n- make it so`)
  })

  it("没找到版本时应抛出异常", async () => {
    await expect(
      main({ filename: testfile, version: "1.8.0" }),
    ).rejects.toThrow("Version not found: 1.8.0")
  })

  it("当latest=true时，应返回最新版本", async () => {
    const result = await main({ filename: testfile, latest: true })

    expect(result).toBe(`- foo`)
  })

  it("当 latest = true 且 withTitle = true 时，应拼接标题与内容", async () => {
    const result = await main({
      filename: testfile,
      latest: true,
      withTitle: true,
    })

    expect(result).toBe(`unreleased\r\n\r\n- foo`)
  })

  it("当 tag 为 h1 时，使用单个 # 前缀", async () => {
    const result = await main({
      filename: vitepress,
      version: "1.6.0",
      withTitle: true,
    })

    expect(
      result.startsWith(
        `# [1.6.0](https://github.com/vuejs/vitepress/compare/v1.5.0...v1.6.0) (2025-01-20)`,
      ),
    ).toBe(true)
  })
})
