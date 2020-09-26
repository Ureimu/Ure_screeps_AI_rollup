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
    };
    return workFunctionList;
}
