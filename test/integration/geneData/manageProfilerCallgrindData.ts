/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import { getDirectedGraph } from "./directedGraph";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const { mkdirSync, writeFile } = require("fs");

const DIST = "./test/data/";

export function storeOutputFile(
    data: Memory & { callgrind: string; profiler: Record<string, unknown> },
    RCL: number,
    analyseData: analyseData,
    idData: nameToId
) {
    const fileName = "memory.json";
    const now = new Date();
    const path = `${DIST}${now.toLocaleDateString()}/${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}/`;
    mkdirSync(path, { recursive: true });
    const callgrindFileName = `callgrind.RCL${RCL}.dat`;
    // 读取下面数据的软件可以在群里下载，叫qcachegrind。
    writeFile(path + callgrindFileName, data.callgrind, "utf8", (err: string) => {
        if (err) {
            console.log("写入文件出错！具体错误：" + err);
        } else {
            console.log("创建callgrind数据文件成功");
        }
    });
    data.callgrind = "";
    data.profiler = {};
    // memory数据。
    writeFile(path + fileName, JSON.stringify(data), "utf8", (err: string) => {
        if (err) {
            console.log("写入文件出错！具体错误：" + err);
        } else {
            console.log("创建memory.json数据文件成功");
        }
    });
    console.log(`analyseData.length:${analyseData.length},Object.keys(idData).length:${Object.keys(idData).length}}`);
    // 读取下面数据的软件可以在这个库下载：https://github.com/Ureimu/screepsGraphs
    writeFile(path + "eventLog.json", getDirectedGraph(analyseData, idData), "utf8", (err: string) => {
        if (err) {
            console.log("写入文件出错！具体错误：" + err);
        } else {
            console.log("创建eventLog数据文件成功");
        }
    });
}
