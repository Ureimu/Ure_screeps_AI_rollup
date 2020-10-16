import actionCounter from "utils/actionCounter";
import { spawnTaskList } from "task/spawnTask";
import { GUIfun } from "visual/roomVisual/GUI";

export function globalConstantRegister(): void {//在global上写入全局常量对象
    if(!global.spawnTaskList){
        global.spawnTaskList = spawnTaskList();
    }

    if(!global.GUI){
        global.GUI = GUIfun();
    }

    actionCounter.warpActions();
}
