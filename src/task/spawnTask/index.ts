import { harvestSource } from "./roomMaintenceTask/harvestSource";
import { carrySource } from "./roomMaintenceTask/carrySource";
import { buildAndRepair } from "./roomMaintenceTask/buildAndRepair";
import { upgradeController } from "./roomMaintenceTask/upgradeController";
import { carryResource } from "./roomMaintenceTask/carryResource";
import { sledge } from "./outwardsTask/war/sledge";
import { aio } from "./outwardsTask/war/aio";
import { ferret } from "./outwardsTask/outwardsSource/ferret";
import { oCarrySource } from "./outwardsTask/outwardsSource/oCarrySource";
import { oClaimer } from "./outwardsTask/outwardsSource/oClaimer";
import { oHarvestSource } from "./outwardsTask/outwardsSource/oHarvestSource";
import { centerCarry } from "./roomMaintenceTask/centerCarry";

export function spawnTaskList() {
    return {
        roomMaintance:{
            harvestSource: harvestSource,
            carrySource: carrySource,
            upgradeController: upgradeController,
            buildAndRepair: buildAndRepair,
            carryResource: carryResource,
            centerCarry: centerCarry,
        },
        war:{
            sledge: sledge,
            aio: aio
        },
        oSourceFarming:{
            ferret: ferret,
            oCarrySource: oCarrySource,
            oClaimer:oClaimer,
            oHarvestSource:oHarvestSource,
        }
    };
}
