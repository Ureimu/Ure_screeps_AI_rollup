/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { assert } from "chai";
import { storeOutputFile } from "./geneData/manageProfilerCallgrindData";
import { getAnalyzeDataAfterTick } from "./geneData/runAfterTick";
import { helper } from "./helper";
import { initRCLTestRoom } from "./init/initRCLTestRoom";
import { runCreepTest } from "./run/runCreepTest";
import { printDebugInfo } from "./utils/printDebugInfo";
import { updateSpawnRoomObj, upgradeController } from "./utils/updateObjects";

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

    it("测试geneData模块", async function () {
        const tickNum = 4000;
        const spawnRoom = "W2N2";
        const controllerId = await initRCLTestRoom(helper, spawnRoom);
        let RCL = 1;
        const analyseData: analyseData = [];
        const idData: nameToId = {};
        const controllerData: controllerData = {};

        for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
            await helper.server.tick();
            await getAnalyzeDataAfterTick(gameTime, controllerData, helper, idData, analyseData);
            _.each(await helper.user.newNotifications, ({ message }) => console.log("[notification]", message));
            if (gameTime % 100) continue;
            const { db } = helper.server.common.storage;
            const memory: Memory = JSON.parse(await helper.user.memory);
            printDebugInfo(memory, gameTime, spawnRoom);
            const controllerLevel = memory.rooms?.[spawnRoom].roomControlStatus[0];
            if (controllerLevel !== undefined && controllerLevel >= RCL + 1) {
                RCL++;
                for (const error of memory.errors?.errorList) {
                    console.log(error + "\n");
                }
                // 存callgrind数据
                await helper.user.console(
                    `Memory.callgrind=Game.profiler.callgrindStr();Game.profiler.reset();Game.profiler.background()`
                );
                await helper.server.tick();
                const lastMemory: Memory & { callgrind: string; profiler: Record<string, unknown> } = JSON.parse(
                    await helper.user.memory
                );
                storeOutputFile(lastMemory, RCL, analyseData, idData);
                assert.equal(
                    lastMemory.errors?.errorList.length,
                    0,
                    `got ${lastMemory.errors?.errorList.length} errors,please check the console output above.`
                );
                if (RCL === 2) break;
                await upgradeController(db, controllerId, RCL);
            }

            if (memory.errors?.errorList) {
                console.log(memory.errors.errorList.toString());
            }

            await updateSpawnRoomObj(db, spawnRoom);
        }
    });
});
