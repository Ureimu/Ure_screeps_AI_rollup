import { lookForStructure } from "utils/findEx";
import { stateCut } from "work/creep/utils/utils";
import taskPool from "task/utils/taskPool";

function isRoleCreepMemory(target: CreepMemory): target is RoleCreepMemory<"carryResource"> {
    return target.task.taskType === "carryResource";
}

export function carryResource(creep: Creep): void {
    if (isRoleCreepMemory(creep.memory)) {
        const task = creep.memory.task;
        if (task?.taskInf) {
            const resourceType = task.taskInf.resourceType;
            const carryFrom = task.taskInf.structureCarryFrom;
            const carryTo = task.taskInf.structureCarryTo;

            const ifHarvesting = stateCut(
                creep,
                [() => Number(creep.store[resourceType] === 0), () => Number(creep.store.getFreeCapacity() !== 0)],
                0
            );

            const ifFinishTask = stateCut(creep, [() => 0, () => 0], 1);

            if (ifHarvesting) {
                const structureCarryFrom = lookForStructure(creep.room, carryFrom, true) as AnyStoreStructure[];
                if (structureCarryFrom) {
                    creep.getResourceFromStructure(structureCarryFrom[0], resourceType);
                }
            } else {
                const structureCarryTo = lookForStructure(creep.room, carryTo, true) as AnyStoreStructure[];
                if (structureCarryTo) {
                    creep.transportResource(structureCarryTo[0], resourceType);
                }
            }

            if (ifFinishTask) {
                delete creep.memory.task.taskInf;
            }
        } else {
            if (Game.time % 5 !== 0) return;
            const m = taskPool.initQueue("carryTask", Memory.rooms[creep.room.name].taskPool);
            if (m.isEmpty()) {
                creep.memory.task.taskInf = (m.pop() as CarryTaskInf).taskInf;
            }
            taskPool.setQueue(m, "carryTask", Memory.rooms[creep.room.name].taskPool);
        }
    }
}
