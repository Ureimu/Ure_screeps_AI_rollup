import { aio } from "./outwardsTask/war/aio";
import { buildAndRepair } from "./roomMaintenanceTask/buildAndRepair";
import { carryResource } from "./roomMaintenanceTask/carryResource";
import { carrySource } from "./roomMaintenanceTask/carrySource";
import { centerCarry } from "./roomMaintenanceTask/centerCarry";
import { harvestSource } from "./roomMaintenanceTask/harvestSource";
import { sledge } from "./outwardsTask/war/sledge";
import { upgradeController } from "./roomMaintenanceTask/upgradeController";
import * as profiler from "../../../utils/profiler";
import { sourceScout } from "./outwardsTask/outwardsSource/sourceScout";
import { oHarvestSource } from "./outwardsTask/outwardsSource/oHarvestSource";

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
            aio,
            // oHarvest
            sourceScout,
            oHarvestSource
        };
        profiler.registerObject(workFunctionList, "creepWork.role");
        return workFunctionList;
    },

    compareTaskType(creep: Creep, workFunction: { (creep: Creep): void }, taskName: string): void {
        if (creep.memory.task.taskName === taskName) {
            workFunction(creep);
        }
    },

    run(creep: Creep): void {
        const workFunctionList = this.TaskReg();

        for (const taskName in workFunctionList) {
            this.compareTaskType(creep, workFunctionList[taskName], taskName);
        }
    }
};
profiler.registerObject(creepWork, "creepWork");

export default creepWork;
