import profiler from "utils/profiler";
import { aio } from "./outwardsTask/war/aio";
import { sledge } from "./outwardsTask/war/sledge";
import { buildAndRepair } from "./roomMaintenanceTask/buildAndRepair";
import { carryResource } from "./roomMaintenanceTask/carryResource";
import { carrySource } from "./roomMaintenanceTask/carrySource";
import { harvestSource } from "./roomMaintenanceTask/harvestSource";
import { upgradeController } from "./roomMaintenanceTask/upgradeController";

let creepWork ={
    TaskReg() {
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
        profiler.registerObject(workFunctionList, 'creepWork.role');
        return workFunctionList;
    },

    compareTaskType(creep: Creep, workFunction: {(creep: Creep):void}, taskType: string) {
        if (creep.memory.task.taskType == taskType) {
            creep.pushBackTask();
            workFunction(creep);
        }
    },

    run(creep: Creep): void {
        let workFunctionList = this.TaskReg();

        for (let taskType in workFunctionList) {
            this.compareTaskType(creep, workFunctionList[taskType], taskType);
        }
    }
}
profiler.registerObject(creepWork, 'creepWork');

export default creepWork;
