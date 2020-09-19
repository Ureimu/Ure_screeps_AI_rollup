import { templateSpawnTask } from "./utils";

export function carrySource(roomName:string) {
    let taskName = "carrySource";
    let t = templateSpawnTask(roomName,taskName,0,12);
    return [t.task]
}
