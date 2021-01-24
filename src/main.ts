import { allocatingSpawnTask } from "task/utils/allocateAndPushTask";
import actionMonitor from "utils/actionMonitor";
import creepWork from "./work/creep/index";
import "../utils/bypass/index";
// import "../utils/buildingCache/index";
import { errorStackVisualize } from "visual/roomVisual/GUIsetting";
import manageCreep from "./manager/manageCreep";
import * as profiler from "../utils/profiler";
// import { ErrorMapper } from "utils/ErrorMapper";
import { mountGlobal } from "mount/mountGlobal";
import manageNewClaimedRoom from "manager/manageNewClaimedRoom";

mountGlobal();
if (!Memory.time) Memory.time = Game.time;
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
// export const loop = ErrorMapper.wrapLoop(() => {
export const loop = (): void => {
    // if (global.time % 100 === 0) throw new Error("100");
    // export const loop = (): void => {
    profiler.wrap(function () {
        try {
            // actionMonitor.getEnergyAction();

            for (const stateCut in global.stateLoop) {
                global.stateLoop[stateCut]();
            }
            // actionCounter.init();
            if (Game.cpu.bucket === 10000) {
                if (Game.cpu.generatePixel) {
                    Game.cpu.generatePixel();
                }
            }

            _.forEach(Game.rooms, room => {
                if (room.controller?.my && room.find(FIND_MY_SPAWNS).length !== 0) {
                    if (!room.memory.initialize) {
                        room.initMemory(false);
                        room.memory.initialize = true;
                        room.manageOutwardsSource();
                    }
                    switch ((Game.time - Memory.time) % global.workRate.spawn) {
                        case 3:
                            room.manageTask();
                            break;
                    }
                    if (Game.time % 400 === 0) room.manageOutwardsSource();
                    room.autoSafeMode();
                    room.autoPlanConstruction();
                    room.roomVisualize();
                    room.runStructure();
                } else {
                    if (!room.memory.sourceInitialize) {
                        room.initMemory(true);
                        room.memory.sourceInitialize = true;
                    }
                    manageNewClaimedRoom(room);
                }
            });

            for (const roomName in Memory.rooms) {
                if (Object.keys(Memory.rooms[roomName]).length === 0) {
                    delete Memory.rooms[roomName];
                }
            }

            switch ((Game.time - Memory.time) % global.workRate.spawn) {
                case 2:
                    manageCreep();
                    break;
                case 3:
                    allocatingSpawnTask("spawnQueue");
                    break;
            }

            for (const spawnName in Game.spawns) {
                Game.spawns[spawnName].spawnTask();
            }

            for (const creepName in Game.creeps) {
                creepWork.run(Game.creeps[creepName]);
            }

            // actionCounter.save(1500);
        } catch (err) {
            errorStackVisualize((err as { stack: string }).stack);
        }
    });
};
// });
