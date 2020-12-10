export function findSpawnOrExtensionNotFull(creep: Creep): AnyStructure[] {
    return creep.room.find(FIND_STRUCTURES, {
        // 标明房间内未装满的扩展和出生点
        filter: structure => {
            return (
                (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
}

export function findContainerResourceLessThan(creep: Creep): AnyStructure[] {
    return creep.room.find(FIND_STRUCTURES, {
        // 标明房间内未装满的扩展和出生点
        filter: structure => {
            return (
                (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
}
