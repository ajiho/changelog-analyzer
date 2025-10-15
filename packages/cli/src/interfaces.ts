export interface CliParserOptions {
  /** 变更日志的文件路径 */
  filename?: string;

  /** 要取得版本号 */
  version?: string;

  /** 最后一个版本 */
  latest?: boolean;

  /** 是否要携带标题 */
  withTitle?: boolean;
}
