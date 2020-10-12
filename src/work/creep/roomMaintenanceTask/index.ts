import { aio } from "../outwardsTask/war/aio";
import { sledge } from "../outwardsTask/war/sledge";
import { buildAndRepair } from "./buildAndRepair";
import { carryResource } from "./carryResource";
import { carrySource } from "./carrySource";
import { harvestSource } from "./harvestSource";
import { upgradeController } from "./upgradeController";

export function roomMaintenanceTaskReg() {
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
