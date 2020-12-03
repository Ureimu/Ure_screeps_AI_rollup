import { assert } from "chai";
import { helper } from "./helper";
import { initRCLTestRoom } from "./init/initRCLTestRoom";

describe("main", () => {
    it("测试服务器的 tick 是否匹配", async function () {
        for (let i = 1; i < 10; i += 1) {
            assert.equal(await helper.server.world.gameTime, i);
            await helper.server.tick();
        }
    });

    it("读写memory", async function () {
        await initRCLTestRoom(helper, 1, "W1N1");
        await helper.player.console(`Memory.foo = 'bar'`);
        await helper.server.tick();
        const memory = JSON.parse(await helper.player.memory);
        assert.equal(memory.foo, "bar");
    });
});
