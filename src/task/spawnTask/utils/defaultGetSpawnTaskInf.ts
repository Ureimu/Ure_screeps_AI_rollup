import { templateSpawnTaskList } from "./templateTask";

export function defaultGetSpawnTaskInf(
    room: Room,
    taskName: string,
    taskKindName: string,
    num: number,
    priority: number
): SpawnTaskInf[] {
    return templateSpawnTaskList(room.name, taskName, taskKindName, num, priority);
}
