import { templateSpawnTask } from "./utils";

export function carrySource(roomName:string) {
    let taskName = "carrySource";
    let t = templateSpawnTask(roomName,taskName,12);
    if(typeof t !== 'undefined'){
        return [t.task]
    }
    return;
}
