import { templateSpawnTask } from "./utils";

export function harvestSource(roomName: string) {
    let taskList:Task[] = [];
    for (let sourceName in Memory.sources) {
        let taskName = 'harvestSource';
        let t = templateSpawnTask(roomName,taskName);
        if(typeof t !== 'undefined'){
            let source = <Source>Game.getObjectById(Memory.sources[sourceName].id);
            t.sponsor(source);
            taskList.push(t.task);
        }
    }
    return taskList;
}
