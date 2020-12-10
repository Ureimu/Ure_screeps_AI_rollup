/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync } = require("fs");
const DIST_MAIN_JS = "dist/main.js";
const DIST_MAIN_JS_MAP = "dist/main.js.map.js";
const DIST_WASM = "dist/priority_queue.wasm";

export default {
    modules: {
        main: readFileSync(DIST_MAIN_JS).toString(),
        "main.js.map": readFileSync(DIST_MAIN_JS_MAP).toString(),
        priority_queue: { binary: readFileSync(DIST_WASM, "base64") }
    }
};
