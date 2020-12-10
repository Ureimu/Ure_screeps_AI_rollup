/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";
import { getRectWall } from "../utils/getRectWall";
import moduleSetting from "../utils/moduleSetting";
const { TerrainMatrix } = require("screeps-server-mockup");

export async function initWorld(helper: IntegrationTestHelper, RCL: number, spawnRoom: string): Promise<void> {
    const { db } = helper.server.common.storage;
    const C = helper.server.constants;
    const terrain: MockedTerrainMatrix = new TerrainMatrix();
    const walls = getRectWall([0, 49], [49, 0]).concat([
        [10, 10],
        [10, 40],
        [40, 10],
        [40, 40]
    ]);
    _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const roomName = `W${i}N${j}`;
            await helper.server.world.addRoom(roomName);
            await helper.server.world.setTerrain(roomName, terrain);
            if (roomName !== spawnRoom) {
                await helper.server.world.addRoomObject(roomName, "controller", 10, 10, { level: 1 });
            }
            await helper.server.world.addRoomObject(roomName, "source", 10, 40, {
                energy: C.SOURCE_ENERGY_CAPACITY,
                energyCapacity: C.SOURCE_ENERGY_CAPACITY,
                ticksToRegeneration: 300
            });
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
    const controller = await helper.server.world.addRoomObject(spawnRoom, "controller", 10, 10, { level: 1 });

    const modules = moduleSetting.modules;
    helper.user = await helper.server.world.addBot({ username: "Ureium", room: spawnRoom, x: 21, y: 26, modules });
    await helper.user.console(`Game.profiler.reset();Game.profiler.background()`);
    await Promise.all([
        db["rooms.objects"].update(
            { _id: controller._id },
            { $set: { level: RCL, progress: C.CONTROLLER_LEVELS[RCL] - 100 - ((RCL - 8) ** 3 + 243) * 50 } }
        )
    ]);
}
