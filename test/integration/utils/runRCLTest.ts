/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "chai";
import { helper } from "../helper";
import { initRCLTestRoom } from "../init/initRCLTestRoom";
import { printDebugInfo } from "../utils/printDebugInfo";
import { storeCallgrindFile } from "./manageProfilerCallgrindData";

export async function runRCLTest(RCL: number, _RCL: number, tickNum: number): Promise<void> {
    const spawnRoom = "W1N1"
    await initRCLTestRoom(helper, RCL,spawnRoom);

    for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
        await helper.server.tick();
        if (gameTime % 100) continue;
        const memory: Memory = JSON.parse(await helper.player.memory);
        printDebugInfo(memory, gameTime, spawnRoom);

        const controllerLevel = memory.rooms?.[spawnRoom].roomControlStatus[0];
        if (controllerLevel !== undefined && controllerLevel >= _RCL) {
            console.log(`RCL${RCL} -> RCL${_RCL} ${gameTime} tick,upgrade speed:${((100+((RCL-8)**3+243)*50)/gameTime).toFixed(2)}`);
            for(let error in memory.errors?.errorList){
                console.log(error+"\n");
            }
            await helper.player.console(`Memory.callgrind=Game.profiler.callgrindStr();`);
            await helper.server.tick();
            const lastMemory = JSON.parse(await helper.player.memory);
            storeCallgrindFile(lastMemory.callgrind,RCL);
            assert.equal(lastMemory.errors?.errorList.length, 0, `got ${lastMemory.errors?.errorList.length} errors,please check the console output above.`);
            break;
        }

        if(memory.errors?.errorList){
            console.log(memory.errors.errorList.toString())
        }

        const { db } = helper.server.common.storage;
        await Promise.all([
            db["rooms.objects"].update({ room: spawnRoom, type: "constructionSite" }, { $set: { progress: 99999 } }),
            db["rooms.objects"].update({ room: spawnRoom, type: "rampart" }, { $set: { hits: 3000000 } }),
            db["rooms.objects"].update({ room: spawnRoom, type: "storage" }, { $set: { store: { energy: 950000 } } })
        ]);

        _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
}
