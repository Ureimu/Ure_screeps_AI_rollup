import { TaskSetting } from "../task/taskClass/TaskSetting";
import * as profiler from "../../utils/profiler";
import { RoomPositionToStr } from "construction/utils/strToRoomPosition";
import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";

const manageCreep = function (): void {
    // 为死亡的creep的memory里面的task执行的函数
    // 在spawn执行任务之前运行
    for (const name in Memory.creeps) {
        const creepRoomName = name.slice(0, name.indexOf("-"));
        if (!(name in Game.creeps)) {
            for (const taskKindNameWithTargetRoomName in global.spawnTaskList[creepRoomName]) {
                const index = taskKindNameWithTargetRoomName.indexOf("-");
                const taskGroupName = taskKindNameWithTargetRoomName.slice(0, index === -1 ? undefined : index);
                switch (taskGroupName) {
                    case "roomMaintenance":
                        defaultManager(name, creepRoomName, taskKindNameWithTargetRoomName);
                        break;

                    case "war":
                        break;

                    case "outwardsSource":
                        if (taskKindNameWithTargetRoomName.split("-")[1] !== name.split("-")[2]) break;
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
    const rts = new RoomPositionToStr();
    if (Memory.creeps[name]?.task.taskName in global.spawnTaskList[creepRoomName][taskKindNameWithTargetRoomName]) {
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
                rts.setPosToStr(global.creepMemory[name].bundledUpgradePos as RoomPosition)
            );
            global.creepMemory[name].bundledUpgradePos = undefined;
        }
        delete global.creepMemory[name];
        roomTask.deleteTask();
        if (roomTask.runningNumber < 0) {
            throw new TypeError("roomTask.runningNumber不能为负数。");
        }
        if (roleTaskInf.numberSetting <= roomTask.runningNumber) {
            global.log(
                `[task]  删除任务${name} ${taskKindNameWithTargetRoomName},${Memory.creeps[name].task.taskName} ${roleTaskInf.numberSetting}<=${roomTask.runningNumber}`
            );
            delete Memory.creeps[name];
        } else {
            global.log(
                `[task]  回推任务${taskKindNameWithTargetRoomName},${Memory.creeps[name].task.taskName} ${roleTaskInf.numberSetting}>${roomTask.runningNumber}`
            );
            Memory.creeps[name].task.spawnInf.isRunning = true;
            roomTask.pushTaskToSpawn(task);
        }
    }
}
