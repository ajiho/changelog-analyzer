import MarkdownIt from "markdown-it";
import { fromPromise, fromCallback } from "universalify";
import { readFile, readFileSync } from "node:fs";

import { isObject, isString, isUndefined } from "is-what";
import type { Options, Changelog, Section } from "./types";

export type { Changelog } from "./types.js";

const md = new MarkdownIt();

const VERSION_RE = /\[?v?([\w\d.-]+\.[\w\d.-]+[a-zA-Z0-9])\]?/;
const DATE_RE = /(\d{4}-\d{2}-\d{2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/;
const UNRELEASED_RE = /\b(unreleased)\b/i;
const REFERENCE_STYLE_LINK_RE = /^\[[^[\]]*\]\s*?:/;

const changelogStructure: Changelog = {
  title: "",
  description: "",
  versions: [],
};

function normalizeOptions(options: string | Partial<Options> = {}): Options {
  if (isString(options)) {
    options = { filePath: options };
  }

  if (!isObject(options)) {
    throw new Error("missing options argument");
  }

  const hasFilePath = !isUndefined(options.filePath);
  const hasText = !isUndefined(options.text);

  if (!hasFilePath && !hasText) {
    throw new Error("must provide filePath or text");
  }

  if (hasFilePath && !isString(options.filePath)) {
    throw new Error("invalid filePath, expected string");
  }

  if (hasText && !isString(options.text)) {
    throw new Error("invalid text, expected string");
  }

  const opts: Options = { removeMarkdown: true, throws: true, ...options };

  return opts;
}

function parseChangelogContent(content: string): Changelog {
  const result = parseSection(content);
  const changelog: Changelog = structuredClone(changelogStructure);

  const first = result.at(0);
  if (first && !isVersionHeading(first.title)) {
    changelog.title = first.title;
    changelog.description = first.content;
  }

  const versionSections = result.filter((s) => isVersionHeading(s.title));

  for (const sec of versionSections) {
    const version = sec.title.match(VERSION_RE)?.[1] || null;
    const date = sec.title.match(DATE_RE)?.[1] || null;
    const parsed = parseVersionBody(sec.content);

    changelog.versions.push({
      version,
      tag: sec.tag,
      title: sec.title,
      date,
      body: sec.content,
      parsed,
    });
  }

  return changelog;
}

function parseSection(content: string): Section[] {
  const tokens = md.parse(content, {});
  const lines = content
    .split("\n")
    .filter((l) => !REFERENCE_STYLE_LINK_RE.test(l));

  const parseResult: Section[] = [];
  let current: Section | null = null;
  let startLine: number | null = null;
  for (const [i, token] of tokens.entries()) {
    if (token.type === "heading_open" && /^h[12]$/.test(token.tag)) {
      const inline = tokens[i + 1];
      const titleText = inline?.content?.trim() || "";

      if (current && startLine !== null) {
        current.content = sliceContent(lines, startLine, token.map![0]);
        parseResult.push(current);
      }

      current = { title: titleText, content: "", tag: token.tag };
      startLine = token.map![1];
    }
  }

  if (current && startLine !== null) {
    current.content = sliceContent(lines, startLine, lines.length);
    parseResult.push(current);
  }

  return parseResult;
}

function parseVersionBody(body: string): Record<string, string[]> {
  const tokens = md.parse(body, {});
  const lines = body.split("\n");
  const result: Record<string, string[]> = { _: [] };

  let currentSection: string | null = null;

  for (const [i, token] of tokens.entries()) {
    if (token.type === "heading_open" && /^h\d+$/.test(token.tag)) {
      const inline = tokens[i + 1];
      currentSection = inline?.content?.trim() || "";
      if (currentSection && !result[currentSection]) {
        result[currentSection] = [];
      }
      continue;
    }

    if (token.type === "list_item_open" && token.level === 1) {
      const start = token.map?.[0];
      const end = token.map?.[1];
      if (start != null && end != null) {
        const fullText = sliceContent(lines, start, end);

        result._!.push(fullText);

        if (currentSection && result[currentSection]) {
          result[currentSection]!.push(fullText);
        }
      }
    }
  }

  return result;
}

function sliceContent(
  lines: string[],
  startLine: number,
  endLine: number,
): string {
  return lines.slice(startLine, endLine).join("\n").trim();
}

function isVersionHeading(titleText: string): boolean {
  return UNRELEASED_RE.test(titleText) || VERSION_RE.test(titleText);
}

const parseChangelog: (options: Options) => Promise<Changelog> = fromPromise(
  async (options: Partial<Options> = {}) => {
    const opts = normalizeOptions(options);
    try {
      const content = opts.text
        ? opts.text
        : await fromCallback(readFile)(opts.filePath, "utf-8");

      return parseChangelogContent(content);
    } catch (err) {
      if (opts.throws) {
        throw err;
      }
      return changelogStructure;
    }
  },
) as (options: Options) => Promise<Changelog>;

function parseChangelogSync(content: string): Changelog;
function parseChangelogSync(options?: Partial<Options>): Changelog;
function parseChangelogSync(
  options: string | Partial<Options> = {},
): Changelog {
  const opts = normalizeOptions(options);
  try {
    const content = opts.text
      ? opts.text
      : readFileSync(opts.filePath!, "utf-8");

    return parseChangelogContent(content);
  } catch (err) {
    if (opts.throws) throw err;
    return changelogStructure;
  }
}

export { parseChangelog, parseChangelogSync };
export default parseChangelog;
