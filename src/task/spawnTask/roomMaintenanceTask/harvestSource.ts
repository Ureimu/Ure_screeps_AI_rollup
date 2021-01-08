import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";
import { templateSpawnTask } from "../utils/templateSingleTask";

export function createHarvestSourceTask(
    room: Room,
    taskName: string,
    taskKindName: string,
    i: number,
    priority: number
): SpawnTaskInf[] {
    let k = 0;
    const taskList: SpawnTaskInf[] = [];
    for (const sourceName in room.memory.sources) {
        const targetRoomName = sourceName.slice(0, sourceName.indexOf("Source"));
        if (targetRoomName === room.name) {
            k += 10;
            const t = templateSpawnTask(room.name, taskName, taskKindName, i + k, priority);
            const source = Game.getObjectById<Source>(room.memory.sources[sourceName].id) as Source;
            t.sponsor(source);
            taskList.push(t.task);
        }
    }
    return taskList;
}
