import { globalFunctionRegister } from "mount/mountGlobalFunction";
import { mountPrototypeExtension } from "mount/mountPrototypeExtension";
import profiler from "utils/profiler";
//import actionCounter from "./utils/actionCounter";
import creepWork from "./work/creep/index";
import './utils/bypass';
//import { mountCreepEnergyMonitor } from "utils/energyMonitor";
import { errorStackVisualize } from "visual/roomVisual/GUIsetting";
import manageCreep from "task/manager";
import { globalConstantRegister } from "mount/mountGlobalConstant";
import { allocatingSpawnTask } from "task/utils/allocateAndPushTask";
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
//export const loop = ErrorMapper.wrapLoop(() => {
mountPrototypeExtension();
//mountCreepEnergyMonitor();
globalConstantRegister();
globalFunctionRegister();
if (!Memory.errors) {
    Memory.errors = {
        errorCount: [],
        errorList: [],
        errorIntervals: []
    };
}
profiler.enable();
export const loop = () => {
    profiler.wrap(function () {
        try {
            //actionCounter.init();
            if (Game.cpu.bucket > 9000) {
                if (!!Game.cpu.generatePixel) {
                    Game.cpu.generatePixel();
                }
            }

            _.forEach(Game.rooms, room => {
                if (room.controller?.my) {
                    room.autoSafeMode();
                    room.initMemory(false);
                    room.autoPlanConstruction();
                    room.roomVisualize();
                    room.runStructure();
                    room.manageTask();
                }else{
                    room.initMemory(true);
                }
            });

            allocatingSpawnTask("spawnQueue");
            manageCreep();

            for (let spawnName in Game.spawns) {
                if (!Game.spawns[spawnName].spawning) {
                    Game.spawns[spawnName].spawnTask();
                }
            }

            for (let creepName in Game.creeps) {
                creepWork.run(Game.creeps[creepName]);
            }

            //actionCounter.save(1500);
        } catch (err) {
            errorStackVisualize(err.stack);
        }
    });
}; //);
