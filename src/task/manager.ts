import { getBpByRole } from "./spawnTask/utils/bodypartsSetting";
import { RoomTask } from "./utils/RoomTask";

export function manageCreep() {

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            if(Memory.creeps[name].task.taskInf.taskType in Object.keys(global.spawnTaskList)){
                let task = <SpawnTaskInf>Memory.creeps[name].task;
                let roomTask = new RoomTask(task.spawnInf.roomName,task.taskInf.taskType);
                if(!!task.spawnInf){
                    task.spawnInf.bodyparts = getBpByRole(task.taskInf.taskType,task.spawnInf.roomName);
                }
                delete Memory.creeps[name];
                roomTask.pushTaskToSpawn(task);
            }else{
            } //TODO 还没改完)
        }
    }
}
