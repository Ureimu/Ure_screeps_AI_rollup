/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "chai";
import { helper } from "../helper";
import { initRCLTestRoom } from "../init/initRCLTestRoom";
import { printDebugInfo } from "../utils/printDebugInfo";
import { storeOutputFile } from "../utils/manageProfilerCallgrindData";
import { analyseEventLog } from "../utils/getEventLog";
import { updateSpawnRoomObj, upgradeController } from "../utils/updateObjects";
import { getAnalyzeData } from "../utils/getAnalyzeData";

export async function runRCLTest(tickNum: number): Promise<void> {
    const spawnRoom = "W2N2";
    const controllerId = await initRCLTestRoom(helper, spawnRoom);
    let RCL = 1;
    let analyseData: analyseData = [];
    const idData: nameToId = {};
    const controllerData: controllerData = {};

    for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
        await helper.server.tick();
        const { db, env } = helper.server.common.storage;
        const rawEventLog = await env.get(env.keys.ROOM_EVENT_LOG);
        const memory: Memory = JSON.parse(await helper.user.memory);
        await getAnalyzeData(db, idData, gameTime, controllerData);
        const analysed = analyseEventLog(rawEventLog, gameTime, controllerData);
        if (analysed !== []) {
            analyseData = analyseData.concat(analysed);
        }
        _.each(await helper.user.newNotifications, ({ message }) => console.log("[notification]", message));
        if (gameTime % 100) continue;
        printDebugInfo(memory, gameTime, spawnRoom);
        const controllerLevel = memory.rooms?.[spawnRoom].roomControlStatus[0];
        if (controllerLevel !== undefined && controllerLevel >= RCL + 1) {
            // console.log(
            //     `RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick,upgrade speed:${(
            //         (100 + ((RCL - 8) ** 3 + 243) * 50) /
            //         gameTime
            //     ).toFixed(2)}`
            // );
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
            if (RCL === 5) break;
            await upgradeController(db, controllerId, RCL);
        }

        if (memory.errors?.errorList) {
            console.log(memory.errors.errorList.toString());
        }

        await updateSpawnRoomObj(db, spawnRoom);
    }
}
