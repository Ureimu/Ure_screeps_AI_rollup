import { TaskSetting } from "../taskClass/TaskSetting";
import * as profiler from "../../../utils/profiler";
import { setPosToStr } from "construction/utils/strToRoomPosition";
import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";

const manageCreep = function (): void {
    // 为死亡的creep的memory里面的task执行的函数
    // 在spawn执行任务之前运行
    for (const name in Memory.creeps) {
        const creepRoomName = name.slice(0, name.indexOf("-"));
        if (!(name in Game.creeps)) {
            for (const taskKindNameWithTargetRoomName in global.spawnTaskList[creepRoomName]) {
                const index = taskKindNameWithTargetRoomName.indexOf("-");
                const taskKindName = taskKindNameWithTargetRoomName.slice(0, index === -1 ? undefined : index);
                switch (taskKindName) {
                    case "roomMaintenance":
                        defaultManager(name, creepRoomName, taskKindNameWithTargetRoomName);
                        break;

                    case "war":
                        break;

                    case "outwardsSource":
                        defaultManager(name, creepRoomName, taskKindNameWithTargetRoomName);
                        break;
                    default:
                        break;
                }
            }
        }
    }
};

export default profiler.registerFN(manageCreep, "manageCreep");

function defaultManager(name: string, creepRoomName: string, taskKindNameWithTargetRoomName: string) {
    if (Memory.creeps[name].task.taskName in global.spawnTaskList[creepRoomName][taskKindNameWithTargetRoomName]) {
        if (Memory.creeps[name].task.spawnInf.isRunning === true) return;
        const task = Memory.creeps[name].task as SpawnTaskInf;
        const roleTaskInf =
            global.spawnTaskList[creepRoomName][taskKindNameWithTargetRoomName][Memory.creeps[name].task.taskName];
        const roomTask = new TaskSetting(task.spawnInf.roomName, taskKindNameWithTargetRoomName, task.taskName);
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
            Memory.creeps[name].task.spawnInf.isRunning = true;
            roomTask.pushTaskToSpawn(task);
        }
    }
}
