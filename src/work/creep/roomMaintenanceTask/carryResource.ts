import { lookForStructurePos, lookForStructure } from "AllUtils/findEx";
import { stateCut, transportResource, getResourceFromStructure } from "work/creep/utils/utils";

export function carryResource(creep: Creep): void {
    let resourceType = <ResourceConstant>creep.memory.task.missionInf['resourceType'];
    let carryFrom = <string>creep.memory.task.missionInf["carryFrom"];
    let carryFromStructureType = <StructureConstant>creep.memory.task.missionInf["carryFromStructureType"];
    let carryTo = <string>creep.memory.task.missionInf["carryTo"];
    let carryToStructureType = <StructureConstant>creep.memory.task.missionInf["carryToStructureType"];
    let amount = <number>creep.memory.task.missionInf["amount"];

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
