import { getRoleList } from "task/spawnTask/indexRoleSetting";
import { GUIfun } from "visual/roomVisual/GUI";
export function globalConstantRegister(): void {
    // 在global上写入全局常量对象
    global.testMode = true;
    global.workRate = {
        manageTask: global.testMode ? 15 : 300,
        construction: global.testMode ? 100 : 1500,
        spawn: global.testMode ? 40 : 70
    };
    global.GUI = GUIfun();
    global.creepMemory = {};
    global.monitor = {
        upgradeSpeed: []
    };
    global.rooms = {};
    global.spawnTaskList = {};
    _.forEach(Game.rooms, room => {
        if (room.controller?.my) {
            global.rooms[room.name] = {};
            room.controller.initsGlobalMemory();
            global.spawnTaskList[room.name] = getRoleList(room);
        }
    });
}
