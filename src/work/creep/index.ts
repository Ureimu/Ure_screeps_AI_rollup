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
import { oUpgradeController } from "./outwardsTask/outwardsSource/oUpgradeController";
import { oClaim } from "./outwardsTask/outwardsSource/oClaim";
import { oCarrier } from "./outwardsTask/outwardsSource/oCarrier";

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
            oHarvestSource,
            oUpgradeController,
            oClaim,
            oCarrier
        };
        profiler.registerObject(workFunctionList, "creepWork.role");
        return workFunctionList;
    },

    run(creep: Creep): void {
        if (creep.spawning) return;
        if (!global.creepWorkFunctionList) global.creepWorkFunctionList = this.TaskReg();
        global.creepWorkFunctionList[creep.memory.task.taskName](creep);
    }
};
profiler.registerObject(creepWork, "creepWork");

export default creepWork;
