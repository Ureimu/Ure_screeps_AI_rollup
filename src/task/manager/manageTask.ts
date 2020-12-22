import { runSpawnTask } from "task";
import { RoleSetting } from "task/taskClass/RoleSetting";
import { TaskSetting } from "task/taskClass/TaskSetting";
import * as profiler from "../../../utils/profiler";

const manageTask = function (room: Room): void {
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

export default profiler.registerFN(manageTask, "manageTask");
