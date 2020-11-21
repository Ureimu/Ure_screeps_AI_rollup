import { templateSpawnTask } from "../utils/templateTask";

export function carryResource(roomName:string){
    let taskName = "carryResource";
    let t = templateSpawnTask(roomName,taskName,0,6,false);
    return [t.task]
}
