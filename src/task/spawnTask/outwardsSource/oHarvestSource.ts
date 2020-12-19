import { templateSpawnTask } from "../utils/templateSingleTask";

export function createOHarvestSourceTask(
    room: Room,
    taskName: string,
    taskKindName: string,
    i: number,
    priority: number
): SpawnTaskInf[] {
    let k = 0;
    const taskList: SpawnTaskInf[] = [];
    const targetRoomName = taskKindName.slice(taskKindName.indexOf("-") + 1);
    for (const sourceName in Memory.sources) {
        const sourceRoomName = sourceName.slice(0, sourceName.indexOf("Source"));
        if (sourceRoomName === targetRoomName) {
            k += 10;
            const t = templateSpawnTask(room.name, taskName, taskKindName, i + k, priority);
            const source = Game.getObjectById<Source>(Memory.sources[sourceName].id) as Source;
            t.sponsor(source);
            taskList.push(t.task);
        }
    }
    return taskList;
}
