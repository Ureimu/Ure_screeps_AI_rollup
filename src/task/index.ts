import PriorityQueue from "../../utils/PriorityQueue";
import { SpawnTaskInf } from "./taskClass/extends/SpawnTask";
import { TaskSetting } from "./taskClass/TaskSetting";
import { autoPush } from "./utils/allocateAndPushTask";

export function runSpawnTask(room: Room): void {
    const roomName = room.name;
    for (const taskKindName in global.spawnTaskList[roomName]) {
        for (const taskName in global.spawnTaskList[roomName][taskKindName]) {
            const taskList = new PriorityQueue<SpawnTaskInf>(false);
            const anyRoomTask = new TaskSetting(roomName, taskKindName, taskName);
            if (!anyRoomTask.hasPushed) {
                anyRoomTask.hasPushed = true;
                const roleTaskInf = global.spawnTaskList[roomName][taskKindName][taskName];
                roleTaskInf
                    .getSpawnTaskInf(room, taskName, taskKindName, roleTaskInf.numberSetting, roleTaskInf.priority)
                    ?.forEach(task => taskList.push(task));
                autoPush(anyRoomTask, taskList);
            }
        }
    }
}
