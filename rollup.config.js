/* eslint-disable */
"use strict";
import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from 'rollup-plugin-screeps';
import copy from "rollup-plugin-cpy";
import resolve from '@rollup/plugin-node-resolve';

let cfg;
const dest = process.env.DEST;
if (!dest) {
    console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
    throw new Error("Invalid upload destination");
}

export default {
    input: "src/main.ts",
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true
    },
    external: ['priority_queue'],
    plugins: [
        clear({ targets: ["dist"] }),
        resolve({ rootDir: "src" }),
        commonjs(),
        typescript({ tsconfig: "./tsconfig.json" }),
        screeps({config: cfg, dryRun: cfg == null}),//不要删除或注释掉这一行，会引起sourcemap报错。
        copy({
            files: ["utils/PriorityQueue/priority_queue.wasm", "dist/main.js"], // 在新增了二进制文件后记得在这里添上
            // C:/Users/a1090/AppData/Local/Screeps/scripts/47_103_128_236___21025/default
            // dest: 'C:/Users/a1090/AppData/Local/Screeps/scripts/127_0_0_1___21025/default',//这里填服务器的文件夹名称
            dest: `C:/Users/a1090/AppData/Local/Screeps/scripts/49_235_103_142___21025/default`, // 这里填服务器的文件夹名称
            options: {
                verbose: true
            }
        }),
        copy({
            files: ["dist/main.js.map"], // 在新增了二进制文件后记得在这里添上
            dest: `C:/Users/a1090/AppData/Local/Screeps/scripts/49_235_103_142___21025/default`, // 这里填服务器的文件夹名称
            options: {
                verbose: true,
                rename: basename => `${basename}.js`
            }
        }),
        copy({
            files: ["dist/main.js.map"], // 在新增了二进制文件后记得在这里添上
            dest: `dist/`, // 这里填服务器的文件夹名称
            options: {
                verbose: true,
                rename: basename => `${basename}.js`
            }
        }),
        copy({
            files: ["utils/PriorityQueue/priority_queue.wasm"], // 在新增了二进制文件后记得在这里添上
            // C:/Users/a1090/AppData/Local/Screeps/scripts/47_103_128_236___21025/default
            // dest: 'C:/Users/a1090/AppData/Local/Screeps/scripts/127_0_0_1___21025/default',//这里填服务器的文件夹名称
            dest: `dist/`, // 这里填服务器的文件夹名称
            options: {
                verbose: true
            }
        })
    ]
};
