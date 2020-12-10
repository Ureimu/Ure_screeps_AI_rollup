import { templateSpawnTask } from "../utils/templateTask";

export function harvestSource(roomName: string): SpawnTaskInf[] {
    const taskName = "harvestSource";
    let j = 0;
    return createHarvestSourceTask(taskName, roomName, j++);
}

function createHarvestSourceTask(taskName: string, roomName: string, i: number) {
    let k = 0;
    const taskList: SpawnTaskInf[] = [];
    for (const sourceName in Memory.sources) {
        k += 10;
        const t = templateSpawnTask(roomName, taskName, i + k);
        const source = Game.getObjectById<Source>(Memory.sources[sourceName].id) as Source;
        t.sponsor(source);
        taskList.push(t.task);
    }
    return taskList;
}
