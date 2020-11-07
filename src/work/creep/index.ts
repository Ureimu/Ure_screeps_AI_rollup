import { aio } from "./outwardsTask/war/aio";
import { sledge } from "./outwardsTask/war/sledge";
import { buildAndRepair } from "./roomMaintenanceTask/buildAndRepair";
import { carryResource } from "./roomMaintenanceTask/carryResource";
import { carrySource } from "./roomMaintenanceTask/carrySource";
import { harvestSource } from "./roomMaintenanceTask/harvestSource";
import { upgradeController } from "./roomMaintenanceTask/upgradeController";


function TaskReg() {
    let workFunctionList: {[name: string]:(creep: Creep) => void} = {
        harvestSource: harvestSource,
        carrySource: carrySource,
        upgradeController: upgradeController,
        buildAndRepair: buildAndRepair,
        carryResource: carryResource,
        //war
        sledge:sledge,
        aio:aio,
    };
    return workFunctionList;
}

export function run(creep: Creep) {
    let workFunctionList = TaskReg();

    for (let taskType in workFunctionList) {
        compareTaskType(creep, workFunctionList[taskType], taskType);
    }
}

function compareTaskType(creep: Creep, workFunction: {(creep: Creep):void}, taskType: string) {
    if (creep.memory.task.taskInf.taskType == taskType) {
        creep.pushBackTask();
        workFunction(creep);
    }
}
