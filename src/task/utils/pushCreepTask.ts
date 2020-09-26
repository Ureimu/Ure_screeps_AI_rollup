import { CarryTask } from "./TaskClass";
import taskPool from "./taskPool";

export function pushCreepCarryTask(roomName:string, task:CarryCreepTaskInf){
    let m = taskPool.initQueue("carryTask",Memory.rooms[roomName].taskPool);
    m.push(task);
    taskPool.setQueue(m,"carryTask",Memory.rooms[roomName].taskPool);
}
