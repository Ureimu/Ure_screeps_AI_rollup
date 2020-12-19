import { runSpawnTask } from "task";
import { RoleSetting } from "task/taskClass/RoleSetting";
import { TaskSetting } from "task/taskClass/TaskSetting";
import * as profiler from "../../../utils/profiler";

const manageTask = function (room: Room): void {
    // 为innerRoomTaskSet执行的函数
    if ((Game.time - 4) % global.workRate.spawn !== 0) return; // 在spawn和manageCreep执行任务之前运行
    global.spawnTaskList[room.name] = new RoleSetting(room).roleSettingList; // 更新roleList
    for (const taskKindName in Memory.rooms[room.name].taskSetting) {
        for (const taskName in Memory.rooms[room.name].taskSetting[taskKindName]) {
            const roomTask = new TaskSetting(room.name, taskKindName, taskName);
            // 只自动保持所有正在执行的任务的creep数量
            if (global.spawnTaskList[room.name][taskKindName][taskName].numberSetting > roomTask.runningNumber) {
                roomTask.hasPushed = false;
            }
        }
    }
    runSpawnTask(room);
};

profiler.registerFN(manageTask, "manageTask");
export default manageTask;
