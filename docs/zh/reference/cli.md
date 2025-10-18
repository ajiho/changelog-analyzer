# CLI

对于构建脚本和自动化操作会更便捷。

::: code-group

```sh [npm]
$ npm add --global @changelog-analyzer/cli
```

```sh [pnpm]
$ pnpm add --global @changelog-analyzer/cli
```

```sh [yarn]
$ yarn add --global @changelog-analyzer/cli
```

```sh [bun]
$ bun add --global @changelog-analyzer/cli
```

:::

这会安装一个名为 `changelog-analyzer` 的命令行工具，你只需传入一个 `CHANGELOG.md` 文件即可。

```bash
changelog-analyzer path/to/CHANGELOG.md
```

该命令会在终端中输出表示变更日志内容的 JSON 对象。

另外，你也可以不带任何参数运行，它会自动在当前工作目录中查找 `CHANGELOG.md` 文件。

## 使用

```bash
$ changelog-analyzer --help

    Usage: changelog-analyzer [filename]

    位置：
    filename  要解析的 changelog 文件路径        [字符串] [默认值: "CHANGELOG.md"]

    选项：
    -v, --version     指定要获取的版本号                                  [字符串]
    -l, --latest      只获取最后一个版本                    [布尔] [默认值: false]
    -t, --with-title  在输出时携带 changelog 标题           [布尔] [默认值: false]
        --help        显示帮助信息                                          [布尔]

    示例：
    changelog-analyzer CHANGELOG.md  解析指定的 changelog 文件
```
