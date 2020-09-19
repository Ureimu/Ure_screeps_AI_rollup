import { templateSpawnTask } from "./utils";

export function buildAndRepair(roomName:string) {
    let taskName = "buildAndRepair";
    let t = templateSpawnTask(roomName,taskName,0,9);
    return [t.task]
}
