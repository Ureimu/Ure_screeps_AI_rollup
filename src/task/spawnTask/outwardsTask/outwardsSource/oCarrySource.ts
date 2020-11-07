import { templateSpawnTask } from "task/spawnTask/utils/templateTask";


export function oCarrySource(roomName:string) {
    let taskName = "oCarrySource";
    let t = templateSpawnTask(roomName,taskName,0,4);
    return [t.task]
}
