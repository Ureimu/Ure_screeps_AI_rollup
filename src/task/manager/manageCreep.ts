import { TaskSetting } from "../taskClass/TaskSetting";
import * as profiler from "../../../utils/profiler";
import { setPosToStr } from "construction/utils/strToRoomPosition";

const manageCreep = function (): void {
    // 为死亡的creep的memory里面的task执行的函数
    if ((Game.time - 1) % global.workRate.spawn !== 0) return; // 在spawn执行任务之前运行
    for (const name in Memory.creeps) {
        const creepRoomName = name.slice(0, name.indexOf("-"));
        if (!(name in Game.creeps)) {
            for (const taskKindName in global.spawnTaskList[creepRoomName]) {
                switch (taskKindName) {
                    case "roomMaintenance":
                        if (Memory.creeps[name].task.taskName in global.spawnTaskList[creepRoomName][taskKindName]) {
                            const roleTaskInf =
                                global.spawnTaskList[creepRoomName][taskKindName][Memory.creeps[name].task.taskName];
                            const task = Memory.creeps[name].task as SpawnTaskInf;
                            const roomTask = new TaskSetting(task.spawnInf.roomName, taskKindName, task.taskName);
                            if (roomTask.hasPushedToSpawn === true) break;
                            if (typeof Memory.creeps[name].task.taskInf !== "undefined") {
                                Memory.creeps[name].task.taskInf?.state.splice(0);
                            }
                            if (typeof global.creepMemory[name]?.bundledUpgradePos !== "undefined") {
                                global.rooms[creepRoomName].controller?.blankSpace.push(
                                    setPosToStr(global.creepMemory[name].bundledUpgradePos as RoomPosition)
                                );
                                global.creepMemory[name].bundledUpgradePos = undefined;
                            }
                            delete global.creepMemory[name];
                            if (roleTaskInf.numberSetting < roomTask.runningNumber) {
                                roomTask.deleteTask();
                            } else {
                                roomTask.pushTaskToSpawn(task);
                            }
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
