import { buildAndRepair } from "task/spawnTask/buildAndRepair";
import { carrySource } from "task/spawnTask/carrySource";
import { harvestSource } from "task/spawnTask/harvestSource";
import { upgradeController } from "task/spawnTask/upgradeController";

export function roomMaintenanceTaskReg() {
    let workFunctionList: any = {
        harvestSource: harvestSource,
        carrySource: carrySource,
        upgradeController: upgradeController,
        buildAndRepair: buildAndRepair
    };
    return workFunctionList;
}
