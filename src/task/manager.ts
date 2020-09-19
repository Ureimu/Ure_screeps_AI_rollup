import { getBpByRole } from "utils/bodypartsGenerator";

export function manageCreep(task: Task, roomName: string) {
    if(!!task.spawnInf){
        task.spawnInf.bodyparts = getBpByRole(task.taskInf.taskType,roomName);
    }
    return task;
}
