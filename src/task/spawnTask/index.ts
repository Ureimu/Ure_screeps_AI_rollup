import { harvestSource } from "./roomMaintenceTask/harvestSource";
import { carrySource } from "./roomMaintenceTask/carrySource";
import { buildAndRepair } from "./roomMaintenceTask/buildAndRepair";
import { upgradeController } from "./roomMaintenceTask/upgradeController";
import { carryResource } from "./roomMaintenceTask/carryResource";
import { sledge } from "./outwardsTask/war/sledge";
import { aio } from "./outwardsTask/war/aio";

export function spawnTaskList() {
    return {
        //roomMaintance
        harvestSource: harvestSource,
        carrySource: carrySource,
        upgradeController: upgradeController,
        buildAndRepair: buildAndRepair,
        carryResource: carryResource,
        //war
        sledge: sledge,
        aio: aio
    };
}
