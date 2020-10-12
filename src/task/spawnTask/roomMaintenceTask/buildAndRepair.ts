import { templateSpawnTask } from "../utils/templateTask";

export function buildAndRepair(roomName:string) {
    let taskName = "buildAndRepair";
    let taskList:SpawnTaskInf[] = [];
    for(let i = 0; i<3;i++){
        let t = templateSpawnTask(roomName,taskName,i,9);
        taskList.push(t.task);
    }
    return taskList
}
