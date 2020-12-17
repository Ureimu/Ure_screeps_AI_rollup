import { RoomTask } from "../utils/RoomTask";
import * as profiler from "../../../utils/profiler";
import { setPosToStr } from "construction/utils/strToRoomPosition";

const manageCreep = function (): void {
    // Automatically delete memory of missing creeps
    if ((Game.time - 1) % global.workRate.spawn !== 0) return; // 在spawn执行任务之前运行
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            for (const taskKindName in global.spawnTaskList) {
                switch (taskKindName) {
                    case "roomMaintenance":
                        if (Memory.creeps[name].task.taskType in global.spawnTaskList[taskKindName]) {
                            const task = Memory.creeps[name].task as SpawnTaskInf;
                            const roomTask = new RoomTask(task.spawnInf.roomName, task.taskType);
                            if (roomTask.hasPushedToSpawn === true) break;
                            if (typeof Memory.creeps[name].task.taskInf !== "undefined") {
                                Memory.creeps[name].task.taskInf?.state.splice(0);
                            }
                            if (typeof global.creepMemory[name]?.bundledUpgradePos !== "undefined") {
                                const creepRoomName = name.slice(0, name.indexOf("-"));
                                global.rooms[creepRoomName].controller?.blankSpace.push(
                                    setPosToStr(global.creepMemory[name].bundledUpgradePos as RoomPosition)
                                );
                                global.creepMemory[name].bundledUpgradePos = undefined;
                            }
                            delete global.creepMemory[name];
                            roomTask.pushTaskToSpawn(task);
                            roomTask.hasPushedToSpawn = true;
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
