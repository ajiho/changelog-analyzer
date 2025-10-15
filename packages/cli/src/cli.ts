#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { main } from "./index.js";

await yargs(hideBin(process.argv))
  .scriptName("changelog-parser")
  .usage("Usage: $0 [filename]")
  .example("$0 CHANGELOG.md", "解析指定的 changelog 文件")
  .version(false)
  .option("help", {
    alias: "h",
    type: "boolean",
    description: "显示帮助信息",
  })
  .option("version", {
    alias: "v",
    type: "string",
    description: "指定要获取的版本号",
  })
  .option("latest", {
    alias: "l",
    type: "boolean",
    description: "只获取最后一个版本",
    default: false,
  })
  .option("with-title", {
    alias: "t",
    type: "boolean",
    description: "在输出时携带 changelog 标题",
    default: false,
  })
  .command(
    "$0 [filename]", // 定义命令格式
    "解析指定的 changelog 文件",
    (yargs) => {
      return yargs.positional("filename", {
        describe: "要解析的 changelog 文件路径",
        type: "string",
        default: "CHANGELOG.md",
      });
    },
    async (argv) => {
      try {
        const ouput = await main(argv);

        console.log(ouput);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    },
  )
  .help()
  .parse();
