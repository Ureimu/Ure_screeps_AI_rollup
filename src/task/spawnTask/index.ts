import { aio } from "./outwardsTask/war/aio";
import { buildAndRepair } from "./roomMaintenceTask/buildAndRepair";
import { carryResource } from "./roomMaintenceTask/carryResource";
import { carrySource } from "./roomMaintenceTask/carrySource";
import { centerCarry } from "./roomMaintenceTask/centerCarry";
import { ferret } from "./outwardsTask/outwardsSource/ferret";
import { harvestSource } from "./roomMaintenceTask/harvestSource";
import { oCarrySource } from "./outwardsTask/outwardsSource/oCarrySource";
import { oClaimer } from "./outwardsTask/outwardsSource/oClaimer";
import { oHarvestSource } from "./outwardsTask/outwardsSource/oHarvestSource";
import { sledge } from "./outwardsTask/war/sledge";
import { upgradeController } from "./roomMaintenceTask/upgradeController";

export function spawnTaskList(): {
    [name: string]: {
        [name: string]: (roomName: string) => BaseTaskInf[];
    };
} {
    return {
        roomMaintenance: {
            harvestSource,
            carrySource,
            upgradeController,
            buildAndRepair,
            carryResource,
            centerCarry
        },
        war: {
            sledge,
            aio
        },
        oSourceFarming: {
            ferret,
            oCarrySource,
            oClaimer,
            oHarvestSource
        }
    };
}
