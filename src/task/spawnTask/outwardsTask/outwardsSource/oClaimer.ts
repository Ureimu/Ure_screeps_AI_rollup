import { templateSpawnTask } from "task/spawnTask/utils/templateTask";


export function oClaimer(roomName:string) {
    let taskName = "oClaimer";
    let t = templateSpawnTask(roomName,taskName,0,4);
    return [t.task]
}
