export interface Options {
  filePath?: string
  text?: string
  removeMarkdown?: boolean
  throws?: boolean
}
interface ParsedVersion {
  version: string | null
  title: string
  date: string | null
  tag: string
  body: string
  parsed: Record<string, string[]>
}

export interface Changelog {
  title: string
  description: string
  versions: ParsedVersion[]
}

export interface Section {
  title: string
  content: string
  tag: string
}
