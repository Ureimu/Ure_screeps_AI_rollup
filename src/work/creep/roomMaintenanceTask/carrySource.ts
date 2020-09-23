import { lookForStructurePos } from "AllUtils/findEx";
import { stateCut, getEnergy, transportResource } from "work/creep/utils/utils";
import { findSpawnOrExtensionNotFull, lookForContainer } from "../utils/find";

export function carrySource(creep: Creep): void {
    let ifHarvesting = stateCut(creep, creep.store[RESOURCE_ENERGY] < 50, creep.store.getFreeCapacity() == 0);

    if (ifHarvesting) {
        getEnergy(creep);
    } else {
        let targets = findSpawnOrExtensionNotFull(creep);
        if (targets.length > 0) {
            transportResource(creep, <AnyStructure>creep.pos.findClosestByRange(targets), RESOURCE_ENERGY);
        } else {
            let controllerSourceContainerPos = lookForStructurePos(creep,"controllerSourceContainer");
            let controllerContainer = lookForContainer(controllerSourceContainerPos);
            if (!!controllerContainer) {
                if (controllerContainer.store["energy"] < 200) {
                    transportResource(creep, controllerContainer, RESOURCE_ENERGY);
                }
            }
        }
    }
}
