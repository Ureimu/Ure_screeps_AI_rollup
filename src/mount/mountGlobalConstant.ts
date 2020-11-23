import { spawnTaskList } from "task/spawnTask";
import { GUIfun } from "visual/roomVisual/GUI";

export function globalConstantRegister(): void {//在global上写入全局常量对象
    global.spawnTaskList = spawnTaskList();
    global.GUI = GUIfun();
    global.creepMemory={}
    global.test={}
}
