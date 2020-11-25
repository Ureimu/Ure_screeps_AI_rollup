import profiler from "utils/profiler";
import { getBpByRole } from "./spawnTask/utils/bodypartsSetting";
import { RoomTask } from "./utils/RoomTask";

let manageCreep = function () {

    // Automatically delete memory of missing creeps
    if((Game.time+1) % 15 != 0)return;//在spawn执行任务之前运行
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            for(let taskKindName in global.spawnTaskList){
                switch (taskKindName) {
                    case "roomMaintance":
                        if(Memory.creeps[name].task.taskType in global.spawnTaskList[taskKindName]){
                            let task = <SpawnTaskInf><unknown>Memory.creeps[name].task;
                            let roomTask = new RoomTask(task.spawnInf.roomName,task.taskType);
                            if(!!task.spawnInf){
                                task.spawnInf.bodyparts = getBpByRole(task.taskType,task.spawnInf.roomName);
                            }
                            if(Memory.creeps[name].task.taskInf){
                                Memory.creeps[name].task.taskInf.state = [];
                            }
                            delete Memory.creeps[name];
                            delete global.creepMemory[name];
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

manageCreep = profiler.registerFN(manageCreep, 'manageCreep');
export default manageCreep
