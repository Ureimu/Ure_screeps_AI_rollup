/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { assert } from "chai";
import { helper } from "./helper";
import { initRCLTestRoom } from "./init/initRCLTestRoom";
import { runCreepTest } from "./run/runCreepTest";

describe("main", () => {
    it("测试服务器的 tick 是否匹配", async function () {
        for (let i = 1; i < 10; i += 1) {
            assert.equal(await helper.server.world.gameTime, i);
            await helper.server.tick();
        }
    });

    it("读写memory", async function () {
        await initRCLTestRoom(helper, "W2N2");
        await helper.user.console(`Memory.foo = 'bar'`);
        await helper.server.tick();
        const memory = JSON.parse(await helper.user.memory);
        assert.equal(memory.foo, "bar");
    });

    it("测试状态机函数", async function () {
        await runCreepTest();
    });
});
