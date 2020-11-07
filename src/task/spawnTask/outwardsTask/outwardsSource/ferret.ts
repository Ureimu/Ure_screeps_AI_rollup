import { templateSpawnTask } from "task/spawnTask/utils/templateTask";


export function ferret(roomName:string) {
    let taskName = "ferret";
    let t = templateSpawnTask(roomName,taskName,0,4);
    return [t.task]
}
