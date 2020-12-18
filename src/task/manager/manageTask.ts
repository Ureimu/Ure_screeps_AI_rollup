import { runSpawnTask } from "task";
import { getRoleList } from "task/spawnTask/indexRoleSetting";
import { RoomTask } from "task/utils/RoomTask";
import * as profiler from "../../../utils/profiler";

const manageTask = function (room: Room): void {
    // 为innerRoomTaskSet执行的函数
    if ((Game.time - 4) % global.workRate.spawn !== 0) return; // 在spawn和manageCreep执行任务之前运行
    global.spawnTaskList[room.name] = getRoleList(room); // 更新roleList
    for (const taskName in Memory.rooms[room.name].innerRoomTaskSet) {
        const roomTask = new RoomTask(room.name, taskName);
        // 只自动保持roomMaintenance的数量
        if (
            taskName in global.spawnTaskList[room.name].roomMaintenance &&
            global.spawnTaskList[room.name].roomMaintenance[taskName].numberSetting > roomTask.runningNumber
        ) {
            roomTask.hasPushed = false;
        }
    }
    runSpawnTask(room);
};

profiler.registerFN(manageTask, "manageTask");
export default manageTask;
