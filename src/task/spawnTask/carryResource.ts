import { CarryTask } from "task/utils/TaskClass";
import { templateSpawnTask } from "./utils/templateTask";

export function carryResource(roomName:string){
    let taskName = "carryResource";
    let t = templateSpawnTask(roomName,taskName,0,6);
    let cR = new CarryTask(6);
    let task = Object.assign(t.task,cR.task);
    return [task]
}
