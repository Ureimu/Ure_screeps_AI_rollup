import { returnedRoleSettingList } from "task/taskClass/RoleSetting";
import { GUIfun } from "visual/roomVisual/GUI";

declare global {
    // Types defined in a global block are available globally

    namespace NodeJS {
        interface Global {
            spawnTaskList: {
                [roomName: string]: returnedRoleSettingList;
            };
        }
    }
}

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
    global.monitor = {};
    global.rooms = {};
    global.spawnTaskList = {};
    _.forEach(Game.rooms, room => {
        if (room.controller?.my) {
            global.rooms[room.name] = {};
            room.controller.initsGlobalMemory();
        }
    });
}
