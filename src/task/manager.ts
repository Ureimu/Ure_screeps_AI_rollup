import { getBpByRole } from "./spawnTask/utils/bodypartsSetting";
import { RoomTask } from "./utils/RoomTask";

export function manageCreep() {

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            for(let taskKindName in global.spawnTaskList){
                switch (taskKindName) {
                    case "roomMaintance":
                        if(Memory.creeps[name].task.taskInf.taskType in global.spawnTaskList[taskKindName]){
                            let task = <SpawnTaskInf>Memory.creeps[name].task;
                            let roomTask = new RoomTask(task.spawnInf.roomName,task.taskInf.taskType);
                            if(!!task.spawnInf){
                                task.spawnInf.bodyparts = getBpByRole(task.taskInf.taskType,task.spawnInf.roomName);
                            }
                            Memory.creeps[name].task.taskInf.state = [];
                            delete Memory.creeps[name];
                            roomTask.pushTaskToSpawn(task);
                        }else{
                        } //TODO 还没改完)
                        break;

                    case "war":
                        break;

                    case "oSourceFarming":
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
