import { GUIfun } from "visual/roomVisual/GUI";
import { spawnTaskList } from "task/spawnTask";

export function globalConstantRegister(): void {
    // 在global上写入全局常量对象
    global.testMode = true;
    global.workRate = {
        manageTask: global.testMode ? 15 : 300,
        construction: global.testMode ? 100 : 1500,
        spawn: global.testMode ? 40 : 70
    };
    global.spawnTaskList = spawnTaskList();
    global.GUI = GUIfun();
    global.creepMemory = {};
    global.monitor = {
        upgradeSpeed: []
    };
}
