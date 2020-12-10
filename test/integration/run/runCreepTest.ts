/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { assert } from "chai";
import { helper } from "../helper";
import { initBattleTestRoom } from "../init/initBattleTestRoom";
import { setCreep } from "../utils/setCreep";

export async function runCreepTest(): Promise<void> {
    await initBattleTestRoom(helper);
    const storage = helper.server.common.storage;
    const { db } = storage;
    const C = helper.server.constants;

    const userHarvester = await setCreep(
        helper,
        "harvestSource",
        [
            { type: C.WORK, hits: 100 },
            { type: C.MOVE, hits: 100 },
            { type: C.WORK, hits: 100 },
            { type: C.MOVE, hits: 100 },
            { type: C.WORK, hits: 100 },
            { type: C.MOVE, hits: 100 },
            { type: C.WORK, hits: 100 },
            { type: C.MOVE, hits: 100 },
            { type: C.WORK, hits: 100 },
            { type: C.MOVE, hits: 100 }
        ],
        "W1N1",
        10,
        10,
        { targetFlagName: "attack" },
        helper.user.id
    );

    for (let i = 1; i < 100; i += 1) {
        const userAttackerResult = await db["rooms.objects"].findOne({ name: userHarvester.name });
        if (!userAttackerResult) {
            assert.isNotNull(userAttackerResult);
            break;
        }
        await helper.server.tick();
    }
}
