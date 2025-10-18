# API

## parseChangelog(options)

返回 `Promise<Changelog>`

## parseChangelogSync(options)

返回 `Changelog`

### options

Type: `string | object`

你可以为 `parseChangelog` 函数可选地提供一个配置对象。

你必须提供 `filePath` 或 `text` 其中之一。

如果是字符串类型默认会当作`filePath`来传递。

#### filePath

changelog 文件的路径。

```js
parseChangelog({
  filePath: "path/to/CHANGELOG.md",
})
```

#### text

changelog 文件的文本内容（可用于替代 `filePath`）。

```js
parseChangelog({
  text: "以字符串形式提供的 changelog 原始文本",
})
```

> [!WARNING]
> `text`选项的优先级高于`filePath`。
