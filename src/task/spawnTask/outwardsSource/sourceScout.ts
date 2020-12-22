import { templateSpawnTask } from "../utils/templateSingleTask";

export function createSourceScoutTask(
    room: Room,
    taskName: string,
    taskKindName: string,
    i: number,
    priority: number
): SpawnTaskInf[] {
    const taskList: SpawnTaskInf[] = [];
    const targetRoomName = taskKindName.slice(taskKindName.indexOf("-") + 1);
    const t = templateSpawnTask(room.name, taskName, taskKindName, i, priority, targetRoomName);
    t.addTaskInf({
        scoutRoomName: targetRoomName
    });
    taskList.push(t.task);
    return taskList;
}
