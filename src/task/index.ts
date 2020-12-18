import PriorityQueue from "../../utils/PriorityQueue";
import { RoomTask } from "./utils/RoomTask";
import { autoPush } from "./utils/allocateAndPushTask";

export function runSpawnTask(room: Room): void {
    const roomName = room.name;
    for (const taskKindName in global.spawnTaskList[roomName]) {
        for (const taskName in global.spawnTaskList[roomName][taskKindName]) {
            const taskList = new PriorityQueue(false);
            const anyRoomTask = new RoomTask(roomName, taskName, false);
            if (!anyRoomTask.hasPushed) {
                anyRoomTask.hasPushed = true;
                const roleTaskInf = global.spawnTaskList[roomName][taskKindName][taskName];
                roleTaskInf
                    .getSpawnTaskInf(room, taskName, roleTaskInf.numberSetting, roleTaskInf.priority)
                    ?.forEach(task => taskList.push(task));
                autoPush(anyRoomTask, taskList);
            }
        }
    }
}
