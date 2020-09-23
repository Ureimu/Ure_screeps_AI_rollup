import { getBpByRole } from "AllUtils/bodypartsGenerator";

export function manageCreep(task: SpawnTaskInf, roomName: string) {
    if(!!task.spawnInf){
        task.spawnInf.bodyparts = getBpByRole(task.taskInf.taskType,roomName);
    }
    return task;
}
