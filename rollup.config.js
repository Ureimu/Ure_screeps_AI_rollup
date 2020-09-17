"use strict";

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
//import screeps from 'rollup-plugin-screeps';
import copy from 'rollup-plugin-cpy';

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

  plugins: [
    clear({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    /*copy({
      files: ['src/priority_queue.wasm'],
      dest: 'dist',
      options: {
        verbose: true,
      }
    }),*/
    typescript({tsconfig: "./tsconfig.json"}),
    //screeps({config: cfg, dryRun: cfg == null}),
    copy({
      files: ['src/task/utils/priority_queue.wasm','dist/main.js'],//在新增了二进制文件后记得在这里添上
      dest: 'C:/Users/a1090/AppData/Local/Screeps/scripts/127_0_0_1___21025/main',//这里填服务器的文件夹名称
      options: {
        verbose: true,
      }
    }),
    copy({
      files: ['dist/main.js.map'],//在新增了二进制文件后记得在这里添上
      dest: 'C:/Users/a1090/AppData/Local/Screeps/scripts/127_0_0_1___21025/main',//这里填服务器的文件夹名称
      options: {
        verbose: true,
        rename: basename => `${basename}.js`,
      }
    }),
  ]
}
