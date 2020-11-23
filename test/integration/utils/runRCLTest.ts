/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { helper } from "../helper";
import { initRCLTestRoom } from "../init/initRCLTestRoom";
import { printDebugInfo } from "../utils/printDebugInfo";

export async function runRCLTest(RCL: number, _RCL: number, tickNum: number): Promise<void> {
    await initRCLTestRoom(helper, RCL);

    for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
        await helper.server.tick();
        if (gameTime % 100) continue;
        const memory: Memory = JSON.parse(await helper.player.memory);
        printDebugInfo(memory, gameTime);

        const controllerLevel = memory.rooms?.["W0N0"].roomControlLevel;
        if (controllerLevel !== undefined && controllerLevel >= _RCL) {
            console.log(`RCL${RCL} -> RCL${_RCL} ${gameTime} tick`);
            break;
        }

        if(memory.errors?.errorList){
            console.log(memory.errors.errorList.toString())
        }

        const { db } = helper.server.common.storage;
        await Promise.all([
            db["rooms.objects"].update({ room: "W0N0", type: "constructionSite" }, { $set: { progress: 99999 } }),
            db["rooms.objects"].update({ room: "W0N0", type: "rampart" }, { $set: { hits: 3000000 } }),
            db["rooms.objects"].update({ room: "W0N0", type: "storage" }, { $set: { store: { energy: 950000 } } })
        ]);

        _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
}
