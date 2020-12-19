import { allocatingSpawnTask } from "task/utils/allocateAndPushTask";
import actionMonitor from "utils/actionMonitor";
import creepWork from "./work/creep/index";
import "../utils/bypass/index";
import { errorStackVisualize } from "visual/roomVisual/GUIsetting";
import manageCreep from "task/manager/manageCreep";
import * as profiler from "../utils/profiler";
// import { ErrorMapper } from "utils/ErrorMapper";
import { mountGlobal } from "mount/mountGlobal";
import manageOutwardsSource from "task/manager/manageOutwardsSource";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
// export const loop = ErrorMapper.wrapLoop(() => {
export const loop = (): void => {
    mountGlobal();
    // if (global.time % 100 === 0) throw new Error("100");
    // export const loop = (): void => {
    profiler.wrap(function () {
        try {
            actionMonitor.getEnergyAction();

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
                if (room.controller?.my) {
                    if (!room.memory.initialize) {
                        room.initMemory(false);
                        room.memory.initialize = true;
                        manageOutwardsSource(room);
                    }
                    room.autoSafeMode();
                    room.initMemory(false);
                    room.autoPlanConstruction();
                    room.roomVisualize();
                    room.runStructure();
                    room.manageTask();
                } else {
                    if (!room.memory.initialize) {
                        room.initMemory(true);
                        room.memory.initialize = true;
                    }
                }
            });

            for (const roomName in Memory.rooms) {
                if (Object.keys(Memory.rooms[roomName]).length === 0) {
                    delete Memory.rooms[roomName];
                }
            }

            allocatingSpawnTask("spawnQueue");
            manageCreep();

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
