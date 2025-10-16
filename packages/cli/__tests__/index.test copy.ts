import { main } from "../src"
import parseChangelog from "changelog-analyzer"

vi.mock("changelog-analyzer")

describe("main()", () => {
  const mockParsed = {
    title: "Changelog",
    description: "description",
    versions: [
      {
        version: "1.0.0",
        title: "v1.0.0",
        date: "",
        tag: "h2",
        parsed: {},
        body: "Initial release",
      },
    ],
  }

  beforeEach(() => {
    vi.mocked(parseChangelog).mockResolvedValue(mockParsed)
  })

  it("应解析更改日志文件", async () => {
    const result = await main({})
    expect(parseChangelog).toHaveBeenCalledWith({ filePath: "CHANGELOG.md" })
    expect(result).toEqual(mockParsed)
  })

  it("options 为 undefined 时也能正常运行", async () => {
    // @ts-expect-error 故意传入错误的选项
    const result = await main(undefined)
    expect(result).toEqual(mockParsed)
  })

  it("返回指定的版本", async () => {
    const result = await main({ version: "1.0.0" })
    expect(result).toEqual(mockParsed)
  })

  it("返回指定的版本同时携带标题", async () => {
    const result = await main({ version: "1.0.0", withTitle: true })
    expect(result).toEqual(mockParsed)
  })

  it("没找到版本时应抛出异常", async () => {
    await expect(main({ version: "999.0.0" })).rejects.toThrow(
      "Version not found: 999.0.0",
    )
  })

  it("当latest=true时，应返回最新版本", async () => {
    const result = await main({ latest: true })
    expect(result).toEqual(mockParsed)
  })

  it("当 latest = true 且 withTitle = true 时，应拼接标题与内容", async () => {
    const result = await main({ latest: true, withTitle: true })
    expect(result).toEqual(mockParsed)
  })

  it("当 tag 为 h1 时，使用单个 # 前缀", async () => {
    const mockParsedH1 = {
      ...mockParsed,
      versions: [
        {
          version: "2.0.0",
          title: "v2.0.0",
          date: "",
          tag: "h1",
          parsed: {},
          body: "Major release",
        },
      ],
    }
    vi.mocked(parseChangelog).mockResolvedValue(mockParsedH1)
    const result = await main({ version: "2.0.0", withTitle: true })
    expect(result).toEqual(mockParsedH1)
  })
})
