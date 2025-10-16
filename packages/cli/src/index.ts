import parseChangelog from "changelog-analyzer"
import type { CliParserOptions } from "./interfaces.js"

const DEFAULT = {
  filename: "CHANGELOG.md",
  version: null,
  latest: false,
  withTitle: false,
}

export async function main(options: CliParserOptions) {
  const { filename, version, withTitle, latest } = {
    ...DEFAULT,
    ...(options ?? {}),
  }

  let ret
  const result = await parseChangelog({
    filePath: filename,
  })
  if (version) {
    const found = result.versions.find((v) => v.version === version)
    if (!found) throw new Error(`Version not found: ${version}`)

    const prefix = found.tag === "h1" ? "#" : "##"
    ret = withTitle
      ? `${prefix} ${found.title}\r\n\r\n${found.body}`
      : found.body
  } else if (latest) {
    const last = result.versions[0]
    ret = withTitle ? `${last.title}\r\n\r\n${last.body}` : last.body
  } else {
    ret = result
  }
  return JSON.stringify(ret)
}
