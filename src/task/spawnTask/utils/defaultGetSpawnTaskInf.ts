import { templateSpawnTaskList } from "./templateTask";

export function defaultGetSpawnTaskInf(
    room: Room,
    taskName: string,
    taskGroupName: string,
    num: number,
    priority: number
): SpawnTaskInf[] {
    return templateSpawnTaskList(room.name, taskName, taskGroupName, num, priority);
}
