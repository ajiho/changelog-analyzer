import path from "node:path"
import { execa } from "execa"

const CLI_PATH = path.resolve(__dirname, "../dist/cli.js")
const fixtures = path.resolve(__dirname, "../__tests__/__fixtures__")
const filename = path.join(fixtures, "keepachangelog.md")
const testfile = path.join(fixtures, "test.md")

const parsed = {
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

describe("CLI", () => {
  it("只传递filename时打印分析结果", async () => {
    const { stdout } = await execa("node", [CLI_PATH, testfile])

    expect(JSON.parse(stdout)).toStrictEqual(parsed)
  })
  it("不传任何参数时使用默认 CHANGELOG.md", async () => {
    const { stdout } = await execa("node", [CLI_PATH], {
      cwd: fixtures, // 指定工作目录
    })

    const output = JSON.parse(stdout)

    expect(output).toStrictEqual({
      title: "dsa",
      description: "dsada",
      versions: [],
    })
  })

  it("使用 --version 参数指定版本", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      testfile,
      "--version",
      "1.3.0",
    ])

    expect(stdout).toBe(`- make it so`)
  })

  it("使用 --latest 参数只获取最新版本", async () => {
    const { stdout } = await execa("node", [CLI_PATH, testfile, "--latest"])

    expect(stdout).toBe(`- foo`)
  })

  it("--with-title单独使用无效,依然返回所有的结果", async () => {
    const { stdout } = await execa("node", [CLI_PATH, testfile, "--with-title"])

    expect(JSON.parse(stdout)).toStrictEqual(parsed)
  })

  it("组合参数 --latest --with-title", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      testfile,
      "--latest",
      "--with-title",
    ])

    expect(stdout).toBe(`unreleased\r\n\r\n- foo`)
  })

  it("指定无效版本应报错并退出码为 1", async () => {
    const { stderr, exitCode } = await execa("node", [
      CLI_PATH,
      filename,
      "--version",
      "999.0.0",
    ]).catch((err) => err)
    expect(stderr).toMatch(/Version not found/)
    expect(exitCode).toBe(1)
  })

  it("输出帮助信息 (--help)", async () => {
    const { stdout } = await execa("node", [CLI_PATH, "--help"])

    expect(stdout).toMatch(/Usage:/)
    expect(stdout).toMatch(/--version/)
  })
})
