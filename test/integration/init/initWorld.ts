/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";
import moduleSetting from "../utils/moduleSetting";
const { TerrainMatrix } = require("screeps-server-mockup");

export async function initWorld(helper: IntegrationTestHelper, spawnRoom: string): Promise<string> {
    const { db } = helper.server.common.storage;
    const C = helper.server.constants;
    const terrain: MockedTerrainMatrix = new TerrainMatrix();
    const walls = [
        [10, 10],
        [10, 40],
        [40, 10],
        [40, 40]
    ];
    _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

    for (let i = 1; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            const roomName = `W${i}N${j}`;
            await helper.server.world.addRoom(roomName);
            await helper.server.world.setTerrain(roomName, terrain);
            if (roomName !== spawnRoom) {
                await helper.server.world.addRoomObject(roomName, "controller", 10, 10, { level: 1 });
            }
            await helper.server.world.addRoomObject(roomName, "source", 40, 10, {
                energy: C.SOURCE_ENERGY_CAPACITY,
                energyCapacity: C.SOURCE_ENERGY_CAPACITY,
                ticksToRegeneration: 300
            });
            await helper.server.world.addRoomObject(roomName, "mineral", 40, 40, {
                mineralType: "X",
                density: 3,
                mineralAmount: C.MINERAL_DENSITY[3]
            });
        }
    }
    await helper.server.world.addRoomObject(spawnRoom, "source", 10, 40, {
        energy: C.SOURCE_ENERGY_CAPACITY,
        energyCapacity: C.SOURCE_ENERGY_CAPACITY,
        ticksToRegeneration: 300
    });
    const controller = await helper.server.world.addRoomObject(spawnRoom, "controller", 10, 10, { level: 1 });

    const modules = moduleSetting.modules;
    helper.user = await helper.server.world.addBot({ username: "Ureium", room: spawnRoom, x: 21, y: 26, modules });
    helper.user.on("console", (logs, results, userid, username) => {
        _.each(logs, line => console.log(`[console|${username}]`, line));
    });
    await helper.user.console(`Game.profiler.reset();Game.profiler.background()`);
    await Promise.all([
        db["rooms.objects"].update(
            { _id: controller._id },
            { $set: { level: 1, progress: C.CONTROLLER_LEVELS[1] - 100 - ((1 - 8) ** 3 + 243) * 50 } }
        )
    ]);
    return controller._id;
}
