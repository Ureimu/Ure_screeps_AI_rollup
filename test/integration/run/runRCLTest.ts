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

export async function runRCLTest(tickNum: number): Promise<void> {
    const spawnRoom = "W2N2";
    const controllerId = await initRCLTestRoom(helper, spawnRoom);
    let RCL = 1;

    for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
        await helper.server.tick();
        _.each(await helper.user.newNotifications, ({ message }) => console.log("[notification]", message));
        if (gameTime % 100) continue;
        const { db } = helper.server.common.storage;
        const memory: Memory = JSON.parse(await helper.user.memory);
        printDebugInfo(memory, gameTime, spawnRoom);

        const controllerLevel = memory.rooms?.[spawnRoom].roomControlStatus[0];
        if (controllerLevel !== undefined && controllerLevel >= RCL + 1) {
            console.log(
                `RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick,upgrade speed:${(
                    (100 + ((RCL - 8) ** 3 + 243) * 50) /
                    gameTime
                ).toFixed(2)}`
            );
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
            storeOutputFile(lastMemory, RCL);
            assert.equal(
                lastMemory.errors?.errorList.length,
                0,
                `got ${lastMemory.errors?.errorList.length} errors,please check the console output above.`
            );
            if (RCL === 8) break;
            const C = helper.server.constants;
            await Promise.all([
                db["rooms.objects"].update(
                    { _id: controllerId },
                    { $set: { level: RCL, progress: C.CONTROLLER_LEVELS[RCL] - 100 - ((RCL - 8) ** 3 + 243) * 200 } }
                )
            ]);
        }

        if (memory.errors?.errorList) {
            console.log(memory.errors.errorList.toString());
        }

        await Promise.all([
            db["rooms.objects"]
                .find({ type: "constructionSite" })
                .then((resp: any[]) =>
                    resp.map(cs =>
                        db["rooms.objects"]
                            .findOne({ _id: cs._id })
                            .then((csDetail: { progressTotal: number }) =>
                                db["rooms.objects"].update(
                                    { _id: cs._id },
                                    { $set: { progress: csDetail.progressTotal - 1 } }
                                )
                            )
                    )
                ),
            db["rooms.objects"]
                .find({ type: "spawn" })
                .then((resp: any[]) =>
                    resp.map((cs: { _id: any }) =>
                        db["rooms.objects"]
                            .findOne({ _id: cs._id })
                            .then(() =>
                                db["rooms.objects"].update({ _id: cs._id }, { $set: { store: { energy: 300 } } })
                            )
                    )
                ),
            db["rooms.objects"].update({ room: spawnRoom, type: "constructedWall" }, { $set: { hits: 3000000 } }),
            db["rooms.objects"].update({ room: spawnRoom, type: "rampart" }, { $set: { hits: 3000000 } }),
            db["rooms.objects"].update({ room: spawnRoom, type: "storage" }, { $set: { store: { energy: 950000 } } })
        ]);
    }
}
