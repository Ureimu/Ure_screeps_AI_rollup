import { lookForStructure } from "AllUtils/findEx";
import { stateCut, getEnergy, transportResource } from "work/creep/utils/utils";
import { findSpawnOrExtensionNotFull} from "../utils/find";

export function carrySource(creep: Creep): void {
    let ifHarvesting = stateCut(
        creep,
        [() => ~~(creep.store[RESOURCE_ENERGY] < 50), () => ~~(creep.store.getFreeCapacity() != 0)],
        0
    );;

    if (ifHarvesting) {
        getEnergy(creep,["spawnSourceContainer","innerSourceContainer"],0);
    } else {
        let targets = findSpawnOrExtensionNotFull(creep);
        if (targets.length > 0) {
            transportResource(creep, <AnyStructure>creep.pos.findClosestByRange(targets), RESOURCE_ENERGY);
        } else {
            let controllerContainer = <AnyStoreStructure[]>lookForStructure(creep.room,"controllerSourceContainer",true);
            let spawnContainer = <AnyStoreStructure[]>lookForStructure(creep.room,"spawnSourceContainer",true);
            if (!!controllerContainer[0]) {
                if (controllerContainer[0].store["energy"] < 1000) {
                    transportResource(creep, controllerContainer[0], RESOURCE_ENERGY);
                }
            } else if (!!spawnContainer[0]) {
                if (spawnContainer[0].store["energy"] < 1500) {
                    transportResource(creep, spawnContainer[0], RESOURCE_ENERGY);
                }
            }
        }
    }
}
