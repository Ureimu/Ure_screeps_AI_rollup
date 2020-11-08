import { globalFunctionRegister } from "mount/mountGlobalFunction";
import { mountPrototypeExtension } from "mount/mountPrototypeExtension";
import { ErrorMapper } from "utils/ErrorMapper";
import profiler from "utils/profiler";
//import actionCounter from "./utils/actionCounter";
import { manageTask } from "./task";
import { initNewRoomSetting } from "./updateMemory";
import { run } from "./work/creep/index";
//import './utils/bypass';
//import { mountCreepEnergyMonitor } from "utils/energyMonitor";
import { autoConstruction } from "construction";
import { errorStackVisualize, roomVisualize } from "visual/roomVisual/GUIsetting";
import { runStructure } from "work/structure";
import { manageCreep } from "task/manager";
import { globalConstantRegister } from "mount/mountGlobalConstant";
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
//export const loop = ErrorMapper.wrapLoop(() => {
mountPrototypeExtension();
//mountCreepEnergyMonitor();
globalConstantRegister();
globalFunctionRegister();
profiler.enable();
export const loop = () => {
    profiler.wrap(function () {
        try {
            if (!Memory.errors) {
                Memory.errors = {
                    errorCount: [],
                    errorList: [],
                    errorIntervals: []
                };
            }
            //actionCounter.init();
            if (Game.cpu.bucket > 9000) {
                if (!!Game.cpu.generatePixel) {
                    Game.cpu.generatePixel();
                }
            }

            _.forEach(Game.rooms, room => {
                let eventLog = room.getEventLog();
                let attackEvents = _.filter(eventLog, { event: EVENT_ATTACK });
                attackEvents.forEach(event => {
                    if (event.event == EVENT_ATTACK || EVENT_ATTACK_CONTROLLER) {
                        if (!!room && !!room.controller && room.controller.my) {
                            room.controller.activateSafeMode();
                        }
                    }
                });
            });

            initNewRoomSetting();
            manageTask();
            manageCreep();
            autoConstruction();
            roomVisualize();
            runStructure();

            for (let spawnName in Game.spawns) {
                if (!Game.spawns[spawnName].spawning) {
                    Game.spawns[spawnName].spawnTask();
                }
            }

            for (let creepName in Game.creeps) {
                run(Game.creeps[creepName]);
            }

            //actionCounter.save(1500);
        } catch (err) {
            errorStackVisualize(err.stack);
        }
    });
}; //);
