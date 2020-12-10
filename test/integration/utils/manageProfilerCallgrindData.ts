/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const { mkdirSync, writeFile } = require("fs");

const DIST = "./test/data/";

export function storeCallgrindFile(data: string, RCL: number) {
    let fileName = "";
    const now = new Date();
    const path = `${DIST}${now.toLocaleDateString()}/`;
    mkdirSync(path, { recursive: true });
    fileName = `callgrind.${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-RCL${RCL}.dat`;
    writeFile(path + fileName, data, "utf8", (err: string) => {
        if (err) {
            console.log("写入文件出错！具体错误：" + err);
        } else {
            console.log("创建callgrind数据文件成功");
        }
    });
}
