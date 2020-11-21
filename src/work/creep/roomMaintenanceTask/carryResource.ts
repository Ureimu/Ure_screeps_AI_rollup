import taskPool from "task/utils/taskPool";
import { lookForStructure } from "utils/findEx";
import { stateCut } from "work/creep/utils/utils";

export function carryResource(creep: Creep): void {
    let task = <CarryTaskInf>creep.memory.task;
    if (task?.taskInf) {
        let resourceType = <ResourceConstant>task.taskInf.resourceType;
        let carryFrom = <string>task.taskInf.structureCarryFrom;
        let carryTo = <string>task.taskInf.structureCarryTo;

        let ifHarvesting = stateCut(
            creep,
            [() => ~~(creep.store[resourceType] == 0), () => ~~(creep.store.getFreeCapacity() != 0)],
            0
        );

        let ifFinishTask = stateCut(
            creep,
            [()=>0,()=>0],
            1
        );

        if (ifHarvesting) {
            let structureCarryFrom = <AnyStoreStructure[]>lookForStructure(creep.room, carryFrom, true);
            if (!!structureCarryFrom) {
                creep.getResourceFromStructure(structureCarryFrom[0], resourceType);
            }
        } else {
            let structureCarryTo = <AnyStoreStructure[]>lookForStructure(creep.room, carryTo, true);
            if (!!structureCarryTo) {
                creep.transportResource(structureCarryTo[0], resourceType);
            }
        }

        if(ifFinishTask){
            delete Memory.creeps[creep.name].task.taskInf
        }

    } else {
        if(Game.time%5!=0)return;
        let m = taskPool.initQueue("carryTask",Memory.rooms[creep.room.name].taskPool);
        if(m.isEmpty()){
            creep.memory.task.taskInf=m.pop().taskInf;
        }
        taskPool.setQueue(m,"carryTask",Memory.rooms[creep.room.name].taskPool);
    }
}
