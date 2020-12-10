import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function oHarvestSource(roomName: string): SpawnTaskInf[] {
    const taskName = "oHarvestSource";
    let j = 0;
    return createHarvestSourceTask(taskName, roomName, j++);
}

function createHarvestSourceTask(taskName: string, roomName: string, i: number) {
    let k = 0;
    const taskList: SpawnTaskInf[] = [];
    for (const sourceName in Memory.sources) {
        k += 10;
        const t = templateSpawnTask(roomName, taskName, i + k, 4);
        const source = Game.getObjectById<Source>(Memory.sources[sourceName].id) as Source;
        t.sponsor(source);
        taskList.push(t.task);
    }
    return taskList;
}
