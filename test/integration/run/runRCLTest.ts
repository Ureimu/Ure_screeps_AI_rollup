/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "chai";
import { helper } from "../helper";
import { printDebugInfo } from "../utils/printDebugInfo";
import { storeOutputFile } from "../geneData/manageProfilerCallgrindData";
import { updateSpawnRoomObj, upgradeController } from "../utils/updateObjects";
import { getAnalyzeDataAfterTick } from "../geneData/runAfterTick";
import { initWorld } from "../init/initWorld";

export async function runRCLTest(
    tickNum: number,
    startCallback: () => void = () => {
        return;
    },
    intervalCallback: ({
        memory,
        gameTime,
        spawnRoom,
        db,
        idData
    }: {
        memory: Memory;
        gameTime: number;
        spawnRoom: string;
        db: any;
        idData: nameToId;
    }) => Promise<void> | void = () => {
        return;
    },
    endCallback: () => void = () => {
        return;
    },
    ifStopped: () => boolean = () => {
        return false;
    },
    {
        speedLevel,
        startRCL,
        endRCL,
        printInterval,
        subscribeConsole
    }: { speedLevel: number; startRCL: number; endRCL: number; printInterval: number; subscribeConsole: boolean }
): Promise<void> {
    const spawnRoom = "W2N2";
    const controllerId = await initWorld(helper, { spawnRoom, RCL: startRCL, subscribeConsole });
    let RCL = startRCL;
    await helper.server.tick();
    const analyseData: analyseData = [];
    const idData: nameToId = {};
    const controllerData: controllerData = {};
    startCallback();

    for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
        await helper.server.tick();
        await getAnalyzeDataAfterTick(gameTime, controllerData, helper, idData, analyseData);
        _.each(await helper.user.newNotifications, ({ message }) => console.log("[notification]", message));
        if (gameTime % printInterval) continue;
        const { db } = helper.server.common.storage;
        if (speedLevel >= 2 && gameTime === printInterval) {
            await upgradeController(db, controllerId, RCL, speedLevel);
        }
        const memory: Memory = JSON.parse(await helper.user.memory);
        printDebugInfo(memory, gameTime, spawnRoom);
        await intervalCallback({ memory, gameTime, spawnRoom, db, idData });
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
            if (RCL === endRCL || ifStopped()) {
                endCallback();
                break;
            }
            if (speedLevel >= 2) {
                await upgradeController(db, controllerId, RCL, speedLevel);
            }
        }

        if (memory.errors?.errorList) {
            console.log(memory.errors.errorList.toString());
        }

        if (speedLevel >= 1) {
            await updateSpawnRoomObj(db, spawnRoom);
        }
    }
}
