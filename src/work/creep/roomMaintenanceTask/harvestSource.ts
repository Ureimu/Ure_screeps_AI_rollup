import bodypartsGenerator from "utils/bodypartsGenerator";
import findEx from "utils/findEx";
import { stateCut } from "../utils/utils";

export function harvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    creep.getGlobalMemory();
    const source = Game.getObjectById(creep.memory.task.sponsor as Id<Source>) as Source;
    const arrived = ifMove();
    const sourceName = source.getName();
    if (arrived) {
        if (!creep.room.memory.sources[sourceName].containerConstructionSite) {
            for (const site of creep.room.find(FIND_CONSTRUCTION_SITES)) {
                if (site.structureType === STRUCTURE_CONTAINER && creep.pos.inRangeTo(site, 2)) {
                    creep.room.memory.sources[sourceName].containerConstructionSite = site.id as Id<
                        ConstructionSite<"container">
                    >;
                }
            }
        } else if (!creep.room.memory.sources[sourceName].container) {
            const site = Game.getObjectById(
                creep.room.memory.sources[sourceName].containerConstructionSite as Id<ConstructionSite<"container">>
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
                    if (Game.time % 40 === 0) global.log(`${site.progressTotal}:${site.progress}`);
                    creep.build(site);
                } else {
                    creep.harvest(source);
                }
            } else {
                for (const structure of creep.room.find(FIND_STRUCTURES)) {
                    if (structure.structureType === STRUCTURE_CONTAINER && creep.pos.inRangeTo(structure, 2)) {
                        creep.room.memory.sources[sourceName].container = structure.id;
                    }
                }
            }
        } else {
            if (!global.creepMemory[creep.name].bundledLinkPos) {
                creep.harvest(source);
            } else {
                const container: StructureContainer = findEx.lookForStructureByPos(
                    global.creepMemory[creep.name].bundledPos,
                    STRUCTURE_CONTAINER
                ) as StructureContainer;
                const link: StructureLink = findEx.lookForStructureByPos(
                    global.creepMemory[creep.name].bundledLinkPos,
                    STRUCTURE_LINK
                ) as StructureLink;
                const state = stateCut(
                    creep,
                    [
                        () => {
                            if (container.store.energy < 2000) {
                                return 0;
                            } else {
                                return 1;
                            }
                        },
                        () => {
                            if (link.store.energy === 800 || container.store.energy === 0) {
                                return 0;
                            } else {
                                return 1;
                            }
                        }
                    ],
                    1,
                    ["harvest", "carryEnergyToLink"]
                );
                const carryMax = bodypartsGenerator.getBpNum(creep.memory.task.spawnInf.bodyparts, "carry") * 50;
                switch (state) {
                    case 0:
                        creep.harvest(source);
                        break;
                    case 1:
                        if (creep.store.energy === carryMax) {
                            creep.transfer(link, "energy");
                        } else {
                            creep.withdraw(container, "energy");
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    function ifMove(): boolean {
        const targetPos:
            | RoomPosition
            | {
                  pos: RoomPosition;
              } = global.creepMemory[creep.name].bundledPos || source;
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
