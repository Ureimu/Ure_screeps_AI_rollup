import { getBpByRole } from "./spawnTask/utils/bodypartsSetting";

export function manageCreep(task: SpawnTaskInf, roomName: string) {
    if(!!task.spawnInf){
        task.spawnInf.bodyparts = getBpByRole(task.taskInf.taskType,roomName);
    }
    return task;
}
