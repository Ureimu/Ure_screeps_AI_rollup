/**
 * 包装主函数以方便后续操作。
 *
 * @export
 * @param {*} callback
 */
export function wrap(callback: any): void;
/**
 * 启用profiler.
 *
 * @export
 */
export function enable(): void;
/**
 * 输出调试信息。
 *
 * @export profiler
 * @param {number} passedOutputLengthLimit 返回信息的最大长度。
 * @returns {string} 调试信息
 */
export function output(passedOutputLengthLimit: number): string;
/**
 * 生成一段下载callgrind文件的html代码，在控制台使用可以下载callgrind文件。
 *
 * @export profiler
 * @returns {string} 下载callgrind文件的html代码
 */
export function callgrind(): string;
/**
 * 注册object里的函数到调试模块。
 *
 * @export profiler
 * @param {Record<string, unknown>} object
 * @param {string} label
 * @returns {({
 *               [name in string]: {
 *                   (...args: any[]): any;
 *                   profilerWrapped: boolean;
 *                   toString(): string;
 *               };
 *           }
 *         | undefined)}
 */
export function registerObject(
    object: Record<string, (...args: any[]) => any>,
    label: string
):
    | {
          [name in string]: {
              (...args: any[]): any;
              profilerWrapped: boolean;
              toString(): string;
          };
      }
    | undefined;
/**
 * 注册函数到调试模块。
 *
 * @export
 * @param {(...args: any[]) => any} fn
 * @param {string} functionName
 * @returns {{
 *     (...args: any[]): any;
 *     profilerWrapped: boolean;
 *     toString(): string;
 * }}
 */
export function registerFN(
    fn: (...args: any[]) => any,
    functionName: string
): {
    (...args: any[]): any;
    profilerWrapped: boolean;
    toString(): string;
};
/**
 * 注册类到调试模块。
 *
 * @export
 * @param {Record<string, (...args: any[]) => any>} object
 * @param {string} label
 * @returns {({
 *           [name in string]: {
 *               (...args: any[]): any;
 *               profilerWrapped: boolean;
 *               toString(): string;
 *           };
 *       }
 *     | undefined)}
 */
export function registerClass(
    object: Record<string, (...args: any[]) => any>,
    label: string
):
    | {
          [name in string]: {
              (...args: any[]): any;
              profilerWrapped: boolean;
              toString(): string;
          };
      }
    | undefined;
