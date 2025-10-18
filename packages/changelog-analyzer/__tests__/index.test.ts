import path from "node:path"
import { parseChangelog, parseChangelogSync } from "../src"

const fixturesRoot = path.resolve(__dirname, "../__tests__/__fixtures__")

const keepachangelog = path.join(fixturesRoot, "changelog", "keepachangelog.md")
const astro = path.join(fixturesRoot, "changelog", "astro.md")
const vitepress = path.join(fixturesRoot, "changelog", "vitepress.md")

const changelogText = `
# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Support for Markdown parsing

### Fixed
- Typo in version heading

## [1.0.0] - 2025-01-01
### Added
- Initial release
`

describe("parseChangelog测试", () => {
  it("同步解析变更日志文本", () => {
    const result = parseChangelogSync({ text: changelogText })

    expect(result.title).toBe("Changelog")
    expect(result.versions.length).toBe(2)

    const unreleased = result.versions[0]
    expect(unreleased.version).toBeNull()
    expect(unreleased.title).toContain("Unreleased")
    expect(unreleased.parsed["Added"]).toContain(
      "- Support for Markdown parsing",
    )

    const v100 = result.versions[1]
    expect(v100.version).toBe("1.0.0")
    expect(v100.date).toBe("2025-01-01")
    expect(v100.parsed["Added"]).toContain("- Initial release")
  })

  it("异步解析变更日志文本", async () => {
    const result = await parseChangelog({ text: changelogText })
    expect(result.versions.length).toBeGreaterThan(0)
  })

  it("当既没有提供filePath也没有提供文本时，应抛出错误", () => {
    expect(() => parseChangelogSync({})).toThrow()
  })

  it("当options是字符串时，应该被视为filePath", () => {
    const result = parseChangelogSync(keepachangelog)
    expect(result.versions.length).toBe(15)
  })

  it("当传入非对象类型时应抛出错误", () => {
    // @ts-expect-error 故意传入数字
    expect(() => parseChangelogSync(123)).toThrow("missing options argument")
  })

  it("当filePath不是字符串时应抛出错误", () => {
    // @ts-expect-error 故意传入非字符串 filePath
    expect(() => parseChangelogSync({ filePath: 123 })).toThrow(
      "invalid filePath, expected string",
    )
  })

  it("当text不是字符串时应抛出错误", () => {
    // @ts-expect-error 故意传入非字符串 text
    expect(() => parseChangelogSync({ text: 123 })).toThrow(
      "invalid text, expected string",
    )
  })

  it("当解析出错且throws为false时，返回默认结构", () => {
    // 故意传递一个错误的路径
    const result = parseChangelogSync({
      filePath: "Non-existent path",
      throws: false,
    })
    expect(result).toEqual({
      title: "",
      description: "",
      versions: [],
    })
  })

  it("当解析出错且throws为true时,应该抛出异常", () => {
    expect(() =>
      parseChangelogSync({
        filePath: "Non-existent path", // 故意传递一个错误的路径
        throws: true,
      }),
    ).toThrow()
  })

  it("异步模式：解析出错且throws为false时返回默认结构", async () => {
    const result = await parseChangelog({
      filePath: "Non-existent path",
      throws: false,
    })
    expect(result).toEqual({
      title: "",
      description: "",
      versions: [],
    })
  })

  it("异步模式：解析出错且throws为true时应抛出异常", async () => {
    await expect(
      parseChangelog({ filePath: "not-exist.md", throws: true }),
    ).rejects.toThrow()
  })

  it("异步模式：使用filePath读取文件", async () => {
    const result = await parseChangelog({ filePath: keepachangelog })
    expect(result.versions.length).toBe(15)
  })

  it("当版本号为空时，titleText应为空字符串", () => {
    const md = `
# Changelog
## 
Some content here
`
    const result = parseChangelogSync({ text: md })

    const emptyTitleSection = result.versions.find((v) => v.title === "")

    expect(emptyTitleSection).toBeUndefined()
  })

  it("当分类标题为空时，应为空字符串", () => {
    const md = `
# Changelog
## 1.0.0
Some content here

### 

- foo bar
`
    const result = parseChangelogSync({ text: md })

    expect(result.versions[0].parsed).toStrictEqual({
      _: ["- foo bar"],
    })
  })
})
