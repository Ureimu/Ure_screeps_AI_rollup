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
        getEnergy(creep,{"innerSourceContainer":0,"spawnSourceContainer":0});
    } else {
        let targets = findSpawnOrExtensionNotFull(creep);
        if (targets.length > 0) {
            transportResource(creep, <AnyStructure>creep.pos.findClosestByRange(targets), RESOURCE_ENERGY);
        } else {
            let controllerContainer = <AnyStoreStructure[]>lookForStructure(creep.room,"controllerSourceContainer",true);
            let spawnContainer = <AnyStoreStructure[]>lookForStructure(creep.room,"spawnSourceContainer",true);
            let tower = <AnyStoreStructure[]>lookForStructure(creep.room,"tower");
            if (!!controllerContainer && !!controllerContainer[0] && controllerContainer[0].store["energy"] < 1500) {
                transportResource(creep, controllerContainer[0], RESOURCE_ENERGY);
            } else if (!!spawnContainer && !!spawnContainer[0] && spawnContainer[0].store["energy"] < 1500) {
                transportResource(creep, spawnContainer[0], RESOURCE_ENERGY);
            } else if (!!tower&&!!tower[0] && tower[0].store["energy"] < 400) {
                transportResource(creep, tower[0], RESOURCE_ENERGY);
            }
        }
    }
}
