# 快速开始

## 安装

::: code-group

```sh [npm]
$ npm add -D changelog-analyzer
```

```sh [pnpm]
$ pnpm add -D changelog-analyzer
```

```sh [yarn]
$ yarn add -D changelog-analyzer
```

```sh [bun]
$ bun add -D changelog-analyzer
```

:::

现在你已经可以开始使用 changelog-analyzer 了！🎉

## 基本用法

:::tabs
== ES Modules

```js
import { parseChangelog, parseChangelogSync } from "changelog-analyzer"

// 异步 Promise 方式
parseChangelog("CHANGELOG.md")
  .then((result) => console.log(result)) // -> 解析的结构化数据
  .catch((error) => console.error(error))

// 回调函数方式
parseChangelog("CHANGELOG.md", (error, result) => {
  if (error) return console.error(error)
  console.log(result)
  // -> 解析的结构化数据
})

// 同步方法
const result = parseChangelogSync("CHANGELOG.md")
console.log(result) // -> 解析的结构化数据
```

== CommonJS

```js
const { parseChangelog, parseChangelogSync } = require("changelog-analyzer")

// 异步 Promise 方式
parseChangelog("CHANGELOG.md")
  .then((result) => console.log(result)) // -> 解析的结构化数据
  .catch((error) => console.error(error))

// 回调函数方式
parseChangelog("CHANGELOG.md", (error, result) => {
  if (error) return console.error(error)
  console.log(result)
  // -> 解析的结构化数据
})

// 同步方法
const result = parseChangelogSync("CHANGELOG.md")
console.log(result) // -> 解析的结构化数据
```

:::

## CLI

请参阅[CLI文档](/reference/cli)了解此模块的 CLI

## 下一步

- 您可以参阅[API](/reference/api)了解更详细的用法
- 您可以为您的第一语言贡献对应的文档
