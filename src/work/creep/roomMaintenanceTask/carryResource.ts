import { lookForStructurePos, lookForStructure } from "AllUtils/findEx";
import { stateCut, transportResource, getResourceFromStructure } from "work/creep/utils/utils";

export function carryResource(creep: Creep): void {
    let resourceType = <ResourceConstant>creep.memory.task.taskInf['resourceType'];
    let carryFrom = <string>creep.memory.task.taskInf["carryFrom"];
    let carryFromStructureType = <StructureConstant>creep.memory.task.taskInf["carryFromStructureType"];
    let carryTo = <string>creep.memory.task.taskInf["carryTo"];
    let carryToStructureType = <StructureConstant>creep.memory.task.taskInf["carryToStructureType"];

    let ifHarvesting = stateCut(creep, creep.store[resourceType] == 0, creep.store.getFreeCapacity() == 0);

    if (ifHarvesting) {
        let carryFromPos = lookForStructurePos(creep,carryFrom);
        let structureCarryFrom = <AnyStoreStructure>lookForStructure(carryFromPos,carryFromStructureType);
        if(!!structureCarryFrom){
            getResourceFromStructure(creep,structureCarryFrom,resourceType);
        }
    } else {
        let carryToPos = lookForStructurePos(creep,carryTo);
        let structureCarryTo = <AnyStoreStructure>lookForStructure(carryToPos,carryToStructureType);
        if(!!structureCarryTo){
            transportResource(creep, structureCarryTo, resourceType);
        }
    }
}
