import { runRCLTest } from "./run/runRCLTest";
const TICK_NUM = 10000;
const RCL = 7;

describe("main", () => {
    it(`测试 RCL${RCL} -> RCL${RCL + 1}`, async () => {
        await runRCLTest(RCL, RCL + 1, TICK_NUM);
    });
});
