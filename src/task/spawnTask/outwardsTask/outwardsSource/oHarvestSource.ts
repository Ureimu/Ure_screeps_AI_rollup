import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function oHarvestSource(roomName: string) {
    let taskName = "oHarvestSource";
    let j=0;
    return createHarvestSourceTask(taskName, roomName, j++);
}

function createHarvestSourceTask(taskName: string, roomName: string, i: number) {
    let k = 0;
    let taskList: SpawnTaskInf[] = [];
    for (let sourceName in Memory.sources) {
        k+=10;
        let t = templateSpawnTask(roomName, taskName, i+k,4);
        let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
        t.sponsor(source);
        taskList.push(t.task);
    }
    return taskList;
}
