import { lookForStructure } from "utils/findEx";
import { stateCut, transportResource, getResourceFromStructure } from "work/creep/utils/utils";

export function carryResource(creep: Creep): void {
    let task = <CarryCreepTaskInf>creep.memory.task
    if(!!task.missionInf){
        let resourceType = <ResourceConstant>task.missionInf['resourceType'];
        let carryFrom = <string>task.missionInf["carryFrom"];
        let carryTo = <string>task.missionInf["carryTo"];

        let ifHarvesting = stateCut(
            creep,
            [() => ~~(creep.store[resourceType] == 0), () => ~~(creep.store.getFreeCapacity() != 0)],
            0
        );

        if (ifHarvesting) {
            let structureCarryFrom = <AnyStoreStructure[]>lookForStructure(creep.room,carryFrom,true);
            if(!!structureCarryFrom){
                getResourceFromStructure(creep,structureCarryFrom[0],resourceType);
            }
        } else {
            let structureCarryTo = <AnyStoreStructure[]>lookForStructure(creep.room,carryTo,true);
            if(!!structureCarryTo){
                transportResource(creep, structureCarryTo[0], resourceType);
            }
        }
    } else {
//TODO 让creep获取在room的task。
    }
}
