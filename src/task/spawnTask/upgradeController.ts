import { templateSpawnTask } from "./utils";

export function upgradeController(roomName:string) {
    let taskName = "upgradeController";
    let t = templateSpawnTask(roomName,taskName,0,8);
    return [t.spawnTask];
}
