import { RoomTask } from "../utils/RoomTask";
import * as profiler from "../../../utils/profiler";

const manageCreep = function (): void {
    // Automatically delete memory of missing creeps
    if ((Game.time - 1) % global.workRate.spawn !== 0) return; // 在spawn执行任务之前运行
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            for (const taskKindName in global.spawnTaskList) {
                switch (taskKindName) {
                    case "roomMaintance":
                        if (Memory.creeps[name].task.taskType in global.spawnTaskList[taskKindName]) {
                            const task = Memory.creeps[name].task as SpawnTaskInf;
                            const roomTask = new RoomTask(task.spawnInf.roomName, task.taskType);
                            if (typeof Memory.creeps[name].task.taskInf !== "undefined") {
                                Memory.creeps[name].task.taskInf?.state.splice(0);
                            }
                            delete Memory.creeps[name];
                            delete global.creepMemory[name];
                            roomTask.pushTaskToSpawn(task);
                        } // TODO 还没改完)
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
};

profiler.registerFN(manageCreep, "manageCreep");
export default manageCreep;
