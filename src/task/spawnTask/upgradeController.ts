import { templateSpawnTask } from "./utils";

export function upgradeController(roomName:string) {
    let taskName = "upgradeController";
    let t = templateSpawnTask(roomName,taskName,8);
    if(typeof t !== 'undefined'){
        return [t.task];
    }
    return;
}
