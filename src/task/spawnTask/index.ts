import { harvestSource } from "./harvestSource";
import { carrySource } from "./carrySource";
import { buildAndRepair } from "./buildAndRepair";
import { upgradeController } from "./upgradeController";
import { carryResource } from "./carryResource";

export function spawnTaskList() {
    return {
        'harvestSource':harvestSource,
        'carrySource':carrySource,
        'upgradeController':upgradeController,
        'buildAndRepair':buildAndRepair,
        'carryResource':carryResource,
    }
}
