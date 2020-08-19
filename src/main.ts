import { ErrorMapper } from "utils/ErrorMapper";

import actionCounter from "./actionCounter";
actionCounter.warpActions();
import { globalFunctionRegister } from "mount/mountGlobalFunction";
import { mountPrototypeExtension } from "mount/mountPrototypeExtension";
import { initNewRoomSetting } from "./updateMemory";
import { manageTask } from "./manager";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    actionCounter.init();
    console.log(`Current game tick is ${Game.time}`);

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    mountPrototypeExtension();
    globalFunctionRegister();
    initNewRoomSetting();
    manageTask();

    for (let spawnName in Game.spawns) {
        if (!Game.spawns[spawnName].spawning) {
            Game.spawns[spawnName].spawnTask();
        }
    }

    actionCounter.save(1500);
    if (!global.detail) global.detail = actionCounter.singleTick; //打印所有任务的详细cpu消耗情况列表
});
