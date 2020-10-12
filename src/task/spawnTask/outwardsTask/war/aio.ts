import { templateSpawnTask } from "task/spawnTask/utils/templateTask";

export function aio(roomName:string) {
    let taskName = "aio";
    let taskList:SpawnTaskInf[] = [];
    for(let i = 0; i<1;i++){
        let t = templateSpawnTask(roomName,taskName,i,5);
        taskList.push(t.task);
    }
    return taskList
}
