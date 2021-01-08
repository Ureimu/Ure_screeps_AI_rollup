/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { assert } from "chai";
import { helper } from "./helper";
import { initWorld } from "./init/initWorld";
import { runCreepTest } from "./run/runCreepTest";
import { runRCLTest } from "./run/runRCLTest";

describe("main", () => {
    it("测试服务器的 tick 是否匹配", async function () {
        for (let i = 1; i < 10; i += 1) {
            assert.equal(await helper.server.world.gameTime, i);
            await helper.server.tick();
        }
    });

    it("读写memory", async function () {
        await initWorld(helper, {
            spawnRoom: "W2N2",
            RCL: 1,
            subscribeConsole: true
        });
        await helper.user.console(`Memory.foo = 'bar'`);
        await helper.server.tick();
        const memory = JSON.parse(await helper.user.memory);
        assert.equal(memory.foo, "bar");
    });

    it("测试状态机函数", async function () {
        await runCreepTest();
    });

    it("测试geneData模块", async function () {
        await runRCLTest(4000, undefined, undefined, undefined, undefined, {
            speedLevel: 1,
            startRCL: 1,
            endRCL: 2,
            printInterval: 100,
            subscribeConsole: true
        });
    });
});
