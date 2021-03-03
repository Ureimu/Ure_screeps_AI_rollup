// Type definitions for screeps-profiler by screepers
// Project: screeps-profiler
// Definitions by: Ureimu <https://github.com/Ureimu>
/**
 * 该模块的消耗大概在0.08cpu左右。
 *
 */

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
 * @template T
 * @param {T} object
 * @param {string} label
 * @returns {({
 *     [P in keyof T]: T[P] & { profilerWrapped: boolean; toString(): string };
 * })}
 */
export function registerObject<T extends { [name in string]: (...args: any[]) => any }>(
    object: T,
    label: string
): {
    [P in keyof T]: T[P] & { profilerWrapped: boolean; toString(): string };
};
/**
 * 注册函数到调试模块。
 *
 * @export profiler
 * @template T
 * @param {T} fn
 * @param {string} functionName
 * @returns {(T & { profilerWrapped: boolean; toString(): string })}
 */
export function registerFN<T extends (...args: any[]) => any>(
    fn: T,
    functionName: string
): T & { profilerWrapped: boolean; toString(): string };
/**
 * 注册类到调试模块。
 *
 * @export profiler
 * @template T
 * @param {T} object
 * @param {string} label
 * @returns {({
 *     [P in keyof T]: T[P] & { profilerWrapped: boolean; toString(): string };
 * })}
 */
export function registerClass<T extends { [name in string]: (...args: any[]) => any }>(
    object: T,
    label: string
): {
    [P in keyof T]: T[P] & { profilerWrapped: boolean; toString(): string };
};
