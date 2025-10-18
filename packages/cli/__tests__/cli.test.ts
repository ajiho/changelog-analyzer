import path from "node:path"
import { execa } from "execa"

const CLI_PATH = path.resolve(__dirname, "../dist/cli.js")
const fixtures = path.resolve(__dirname, "../__tests__/__fixtures__")
const filename = path.resolve(fixtures, "keepachangelog.md")

describe("CLI", () => {
  it("只传递filename时打印分析结果", async () => {
    const { stdout } = await execa("node", [CLI_PATH, filename])
    const output = JSON.parse(stdout)
    expect(output).toMatchSnapshot()
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
      filename,
      "--version",
      "1.0.0",
    ])

    expect(stdout).toMatchSnapshot()
  })

  it("使用 --latest 参数只获取最新版本", async () => {
    const { stdout } = await execa("node", [CLI_PATH, filename, "--latest"])

    expect(stdout).toMatchSnapshot()
  })

  it("--with-title单独使用无效,依然返回所有的结果", async () => {
    const { stdout } = await execa("node", [CLI_PATH, filename, "--with-title"])
    expect(stdout).toMatchSnapshot()
  })

  it("组合参数 --latest --with-title", async () => {
    const { stdout } = await execa("node", [
      CLI_PATH,
      filename,
      "--latest",
      "--with-title",
    ])
    expect(stdout).toMatchSnapshot()
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
