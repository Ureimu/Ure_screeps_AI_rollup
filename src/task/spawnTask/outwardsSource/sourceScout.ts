import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { templateSpawnTask } from "../utils/templateSingleTask";

export function createSourceScoutTask(
    room: Room,
    taskName: string,
    taskGroupName: string,
    i: number,
    priority: number
): SpawnTaskInf[] {
    const taskList: SpawnTaskInf[] = [];
    const targetRoomName = taskGroupName.slice(taskGroupName.indexOf("-") + 1);
    const t = templateSpawnTask(room.name, taskName, taskGroupName, i, priority, targetRoomName);
    t.addTaskInf({
        scoutRoomName: targetRoomName
    });
    taskList.push(t.task);
    return taskList;
}
