---
sidebar: true
---

# 介绍

<div class="badge">

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/changelog-analyzer)](https://www.npmjs.com/package/changelog-analyzer)
[![cdn version](https://data.jsdelivr.com/v1/package/npm/changelog-analyzer/badge)](https://www.jsdelivr.com/package/npm/changelog-analyzer)
[![codecov](https://codecov.io/gh/ajiho/changelog-analyzer/graph/badge.svg?token=G2P1AI238H)](https://codecov.io/gh/ajiho/changelog-analyzer)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/changelog-analyzer/test.yml?label=Test&logo=codecov&style=flat-square&branch=main)](https://github.com/ajiho/changelog-analyzer/actions/workflows/test.yml)
[![Conventional Changelog](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-conventional--changelog-e10079.svg?style=flat)](https://github.com/conventional-changelog/conventional-changelog)
[![Node](https://img.shields.io/node/v/changelog-analyzer.svg)](https://nodejs.org/en/about/previous-releases)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-fcc72b.svg?logo=vitest)](https://vitest.dev/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

</div>

---

灵感来源于[changelog-parser](https://www.npmjs.com/package/changelog-parser),保持相同的功能,但基于更健壮可靠的[markdown-it](https://github.com/markdown-it/markdown-it)解析markdown内容而非正则提取,在[Keep a Changelog](https://keepachangelog.com/en/1.1.0/)的基础上还支持[vitepress](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md)、[astro](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)开源项目的变更日志的格式解析
。同时为cli补充上了更多有用的选项,满足多种需求。

## 标准

该模块假设你的变更日志是一个使用 [Markdown](http://daringfireball.net/projects/markdown/syntax) 编写的文件，其结构大致如下：

```markdown
# changelog title

A cool description (optional).

## unreleased

- foo

## x.y.z - YYYY-MM-DD (or DD.MM.YYYY, D/M/YY, etc.)

- bar

## [a.b.c]

### Changes

- Update API
- Fix bug #1

## 2.2.3-pre.1 - 2013-02-14

- Update API

## 2.0.0-x.7.z.92 - 2013-02-14

- bark bark
- woof
- arf

## v1.3.0

- make it so

## [1.2.3](link)

- init

[a.b.c]: http://altavista.com
```

解析上述示例将返回以下对象：

```js
{
  title: 'changelog title',
  description: 'A cool description (optional).',
  versions: [
    {
      version: null,
      tag: 'h2',
      title: 'unreleased',
      date: null,
      body: '- foo',
      parsed: { _: [ '- foo' ] }
    },
    {
      version: 'x.y.z',
      tag: 'h2',
      title: 'x.y.z - YYYY-MM-DD (or DD.MM.YYYY, D/M/YY, etc.)',
      date: null,
      body: '- bar',
      parsed: { _: [ '- bar' ] }
    },
    {
      version: 'a.b.c',
      tag: 'h2',
      title: '[a.b.c]',
      date: null,
      body: '### Changes\r\n\r\n- Update API\r\n- Fix bug #1',
      parsed: {
        _: [ '- Update API', '- Fix bug #1' ],
        Changes: [ '- Update API', '- Fix bug #1' ]
      }
    },
    {
      version: '2.2.3-pre.1',
      tag: 'h2',
      title: '2.2.3-pre.1 - 2013-02-14',
      date: '2013-02-14',
      body: '- Update API',
      parsed: { _: [ '- Update API' ] }
    },
    {
      version: '2.0.0-x.7.z.92',
      tag: 'h2',
      title: '2.0.0-x.7.z.92 - 2013-02-14',
      date: '2013-02-14',
      body: '- bark bark\r\n- woof\r\n- arf',
      parsed: { _: [ '- bark bark', '- woof', '- arf' ] }
    },
    {
      version: '1.3.0',
      tag: 'h2',
      title: 'v1.3.0',
      date: null,
      body: '- make it so',
      parsed: { _: [ '- make it so' ] }
    },
    {
      version: '1.2.3',
      tag: 'h2',
      title: '[1.2.3](link)',
      date: null,
      body: '- init',
      parsed: { _: [ '- init' ] }
    }
  ]
}
```

版本号应遵循 [semver](http://semver.org/) 规范，否则其 `version` 属性将被设置为 `null`。

每个条目都会作为一个对象存在于 `versions` 数组中。可以通过以下属性访问特定条目的内容：

- `body` —— 包含当前条目的所有更新、变更等内容的字符串。该属性包括纯文本和 Markdown。
- `parsed` —— 一个对象，指向当前条目的一组或多组数据数组。所有属于当前条目的数据都位于键 `_` 对应的数组中（例如 `parsed._`）。
  如果条目包含子标题（如 `### Added`、`### Changed`），则每个子标题下的内容会出现在对应键名的数组中（例如 `parsed.Added`、`parsed.Changed`）。
  每个数组仅包含纯文本内容。

`CHANGELOG.md` 的格式标准受 [keepachangelog.com](http://keepachangelog.com/) 启发。
