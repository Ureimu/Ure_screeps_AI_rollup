export function oHarvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    const source = Game.getObjectById(creep.memory.task.sponsor as Id<Source>) as Source;
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {
                stroke: "#ffaa00"
            }
        });
    }
}
