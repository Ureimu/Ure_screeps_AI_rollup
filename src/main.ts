import { globalFunctionRegister } from "mount/mountGlobalFunction";
import { mountPrototypeExtension } from "mount/mountPrototypeExtension";
import { ErrorMapper } from "utils/ErrorMapper";
import actionCounter from "./utils/actionCounter";
import { manageTask } from "./task/manager";
import { initNewRoomSetting } from "./updateMemory";
import { run } from './task/workCode';
import { RoomTaskObject } from './task/roomTaskObject'
import './utils/bypass';

actionCounter.warpActions();
let x = new RoomTaskObject('E3S1');
x.interval= 10;
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
    Game.rooms['E3S1'].controller?.activateSafeMode();//这个代码是因为在私服很容易在初期被攻击。

    mountPrototypeExtension();
    globalFunctionRegister();
    initNewRoomSetting();
    manageTask();

    for (let spawnName in Game.spawns) {
        if (!Game.spawns[spawnName].spawning) {
            Game.spawns[spawnName].spawnTask();
        }
    }

    for(let creepName in Game.creeps) {
        run(Game.creeps[creepName]);
    }

    actionCounter.save(1500);
    console.log(actionCounter.ratio());
    if (!global.detail) global.detail = actionCounter.singleTick; //打印所有任务的详细cpu消耗情况列表
});
