import { roomMaintenanceTaskReg } from "./roomMaintenanceTask";

export function run(creep: Creep) {
    let workFunctionList: any = roomMaintenanceTaskReg();

    for (let taskType in workFunctionList) {
        compareTaskType(creep, workFunctionList[taskType], taskType);
    }
}

function compareTaskType(creep: Creep, workFunction: (creep: Creep) => void, taskType: string) {
    if (creep.memory.task.taskInf.taskType == taskType) {
        creep.pushBackTask();
        workFunction(creep);
    }
}
