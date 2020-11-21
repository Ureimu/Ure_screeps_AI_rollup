import taskPool from "./taskPool";

export function pushCarryTask(roomName:string, task:CarryTaskInf){
    let m = taskPool.initQueue("carryTask",Memory.rooms[roomName].taskPool);
    m.push(task);
    taskPool.setQueue(m,"carryTask",Memory.rooms[roomName].taskPool);
}
