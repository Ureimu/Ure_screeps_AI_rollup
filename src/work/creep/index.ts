import { aio } from "./outwardsTask/war/aio";
import { buildAndRepair } from "./roomMaintenanceTask/buildAndRepair";
import { carryResource } from "./roomMaintenanceTask/carryResource";
import { carrySource } from "./roomMaintenanceTask/carrySource";
import { centerCarry } from "./roomMaintenanceTask/centerCarry";
import { harvestSource } from "./roomMaintenanceTask/harvestSource";
import { sledge } from "./outwardsTask/war/sledge";
import { upgradeController } from "./roomMaintenanceTask/upgradeController";
import * as profiler from "../../../utils/profiler";

const creepWork = {
    TaskReg(): {
        [name: string]: (creep: Creep) => void;
    } {
        const workFunctionList: { [name: string]: (creep: Creep) => void } = {
            harvestSource,
            carrySource,
            upgradeController,
            buildAndRepair,
            carryResource,
            centerCarry,
            // war
            sledge,
            aio
        };
        profiler.registerObject(workFunctionList, "creepWork.role");
        return workFunctionList;
    },

    compareTaskType(creep: Creep, workFunction: { (creep: Creep): void }, taskType: string): void {
        if (creep.memory.task.taskType === taskType) {
            workFunction(creep);
        }
    },

    run(creep: Creep): void {
        const workFunctionList = this.TaskReg();

        for (const taskType in workFunctionList) {
            this.compareTaskType(creep, workFunctionList[taskType], taskType);
        }
    }
};
profiler.registerObject(creepWork, "creepWork");

export default creepWork;
