import { templateSpawnTask } from "../utils/templateTask";

export function upgradeController(roomName:string) {
    let taskName = "upgradeController";
    let t = templateSpawnTask(roomName,taskName,0,8);
    return [t.task];
}
