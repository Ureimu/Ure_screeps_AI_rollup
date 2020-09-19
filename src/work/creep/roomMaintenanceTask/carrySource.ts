import { stateCut,getEnergy, transportResource } from "work/creep/utils"
import { findSpawnOrExtensionNotFull, lookForContainer } from "../utils/find";

export function carrySource(creep: Creep): void {
    let ifHarvesting = stateCut(creep, creep.store[RESOURCE_ENERGY] < 50, creep.store.getFreeCapacity() == 0);

    if (ifHarvesting) {
        getEnergy(creep);
    } else {
        let targets = findSpawnOrExtensionNotFull(creep);
        let controllerSourceContainerPos = new RoomPosition(
            Game.rooms[creep.room.name].memory.construction["controllerSourceContainer"].pos[0].x,
            Game.rooms[creep.room.name].memory.construction["controllerSourceContainer"].pos[0].y,
            Game.rooms[creep.room.name].memory.construction["controllerSourceContainer"].pos[0].roomName
        );
        let controllerContainer = lookForContainer(controllerSourceContainerPos);
        if(targets.length>0){
            transportResource(creep, <AnyStructure>creep.pos.findClosestByRange(targets), RESOURCE_ENERGY);
        } else if(!!controllerContainer){
            if(controllerContainer.store["energy"]<200) {
                transportResource(creep, controllerContainer, RESOURCE_ENERGY);
            }
        }
    }
}
