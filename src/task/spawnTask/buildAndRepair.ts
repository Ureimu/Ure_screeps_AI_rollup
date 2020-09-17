import { templateSpawnTask } from "./utils";

export function buildAndRepair(roomName:string) {
    let taskName = "buildAndRepair";
    let t = templateSpawnTask(roomName,taskName,9);
    if(typeof t !== 'undefined'){
        return [t.task]
    }
    return;
}
