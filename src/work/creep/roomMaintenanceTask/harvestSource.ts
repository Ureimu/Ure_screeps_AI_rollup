export function harvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    let source = <Source>Game.getObjectById(<Id<Source>>creep.memory.task.sponsor);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {
                stroke: "#ffaa00"
            }
        });
    }
}
