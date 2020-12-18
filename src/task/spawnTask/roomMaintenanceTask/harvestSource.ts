import { templateSpawnTask } from "../utils/templateSingleTask";

export function createHarvestSourceTask(room: Room, taskName: string, i: number, priority: number): SpawnTaskInf[] {
    let k = 0;
    const taskList: SpawnTaskInf[] = [];
    for (const sourceName in Memory.sources) {
        k += 10;
        const t = templateSpawnTask(room.name, taskName, i + k, priority);
        const source = Game.getObjectById<Source>(Memory.sources[sourceName].id) as Source;
        t.sponsor(source);
        taskList.push(t.task);
    }
    return taskList;
}
