import { stateCut } from "work/creep/utils/utils";

export function oHarvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    creep.getGlobalMemory();
    const source = Game.getObjectById(creep.memory.task.sponsor as Id<Source>);
    if (!source) return;
    const sourceName = source.getName();
    creep.harvest(source);
    const arrived = ifMove();
    if (arrived) {
        if (!Memory.sources[sourceName].containerConstructionSite) {
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
            for (const site of creep.room.find(FIND_CONSTRUCTION_SITES)) {
                if (site.structureType === STRUCTURE_CONTAINER && creep.pos.inRangeTo(site, 2)) {
                    Memory.sources[sourceName].containerConstructionSite = site.id as Id<ConstructionSite<"container">>;
                }
            }
        } else if (!Memory.sources[sourceName].container) {
            const site = Game.getObjectById(
                Memory.sources[sourceName].containerConstructionSite as Id<ConstructionSite<"container">>
            ) as ConstructionSite<"container">;
            if (site) {
                const ifHarvesting = stateCut(
                    creep,
                    [
                        () => Number(creep.store[RESOURCE_ENERGY] === 0),
                        () => Number(creep.store.getFreeCapacity() !== 0)
                    ],
                    0
                );
                if (!ifHarvesting) {
                    creep.build(
                        Game.getObjectById(
                            Memory.sources[sourceName].containerConstructionSite as Id<ConstructionSite<"container">>
                        ) as ConstructionSite<"container">
                    );
                }
            } else {
                for (const structure of creep.room.find(FIND_STRUCTURES)) {
                    if (structure.structureType === STRUCTURE_CONTAINER && creep.pos.inRangeTo(structure, 2)) {
                        Memory.sources[sourceName].container = structure.id;
                    }
                }
            }
        } else {
            const container = Game.getObjectById(
                Memory.sources[sourceName].container as Id<StructureContainer>
            ) as StructureContainer;
            const ifRepairing = stateCut(
                creep,
                [
                    () => {
                        if (container.hits < 50000) {
                            return 1;
                        } else {
                            return 0;
                        }
                    },
                    () => {
                        if (container.hits > 150000) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                ],
                1
            );
            if (ifRepairing) {
                creep.repair(container);
            }
        }
    }

    function ifMove(): boolean {
        const targetPos:
            | RoomPosition
            | {
                  pos: RoomPosition;
              } = global.creepMemory[creep.name].bundledPos || (source as Source);
        if (global.creepMemory[creep.name].bundledPos) {
            if (!creep.pos.isEqualTo(targetPos)) {
                creep.moveTo(targetPos, {
                    visualizePathStyle: {
                        stroke: "#ffaa00"
                    }
                });
                return false;
            } else {
                return true;
            }
        } else {
            if (!creep.pos.inRangeTo(targetPos, 1)) {
                creep.moveTo(targetPos, {
                    visualizePathStyle: {
                        stroke: "#ffaa00"
                    }
                });
                return false;
            } else {
                return true;
            }
        }
    }
}
