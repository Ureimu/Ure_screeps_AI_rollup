import { buildAndRepair } from "./roomMaintenanceTask/buildAndRepair";
import { carrySource } from "./roomMaintenanceTask/carrySource";
import { harvestSource } from "./roomMaintenanceTask/harvestSource";
import { upgradeController } from "./roomMaintenanceTask/upgradeController";

export function run(creep: Creep) {
    let workFunctionList: any = {
        harvestSource: harvestSource,
        carrySource: carrySource,
        upgradeController: upgradeController,
        buildAndRepair: buildAndRepair
    };

    for (let taskType in workFunctionList) {
        compareTaskType(creep, workFunctionList[taskType], taskType);
    }
}

function compareTaskType(creep: Creep, workFunction: (creep: Creep) => void, taskType: string) {
    if (creep.memory.task.taskInf.taskType == taskType) {
        workFunction(creep);
    }
}
