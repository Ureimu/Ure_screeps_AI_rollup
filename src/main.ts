import { globalFunctionRegister } from "mount/mountGlobalFunction";
import { mountPrototypeExtension } from "mount/mountPrototypeExtension";
import { ErrorMapper } from "AllUtils/ErrorMapper";
import actionCounter from "./AllUtils/actionCounter";
import { manageTask } from "./task";
import { initNewRoomSetting } from "./updateMemory";
import { run } from './work/creep/index';
import './AllUtils/bypass';
import { mountCreepEnergyMonitor } from "AllUtils/energyMonitor";
import { autoConstruction } from "construction";
import { roomVisualize } from "visual/roomVisual/test";
import { runStructure } from "work/structure";

actionCounter.warpActions();
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
//export const loop = ErrorMapper.wrapLoop(() => {
export const loop = () => {
    actionCounter.init();

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    mountPrototypeExtension();
    mountCreepEnergyMonitor();
    globalFunctionRegister();
    initNewRoomSetting();
    manageTask();
    autoConstruction();
    roomVisualize();
    runStructure();

    for (let spawnName in Game.spawns) {
        if (!Game.spawns[spawnName].spawning) {
            Game.spawns[spawnName].spawnTask();
        }
    }

    for(let creepName in Game.creeps) {
        run(Game.creeps[creepName]);
    }

    actionCounter.save(1500);
}//);
