import { runRCLTest } from "./run/runRCLTest";
const TICK_NUM = 60000;

describe("测试RCL", () => {
    it(`测试 RCL1 -> RCL8`, async () => {
        await runRCLTest(TICK_NUM);
    });
});
