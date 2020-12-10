import { getBpNum } from "utils/bodypartsGenerator";
import { lookForStructureByPos } from "utils/findEx";
import { stateCut } from "../utils/utils";

export function harvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    getGlobalMemory(creep);
    const source = Game.getObjectById(creep.memory.task.sponsor as Id<Source>) as Source;
    ifMove();
    if (!global.creepMemory[creep.name].bundledLinkPos) {
        creep.harvest(source);
    } else {
        const container: StructureContainer = lookForStructureByPos(
            global.creepMemory[creep.name].bundledPos,
            STRUCTURE_CONTAINER
        ) as StructureContainer;
        const link: StructureLink = lookForStructureByPos(
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
                    if (link.store.energy === 800) {
                        return 0;
                    } else {
                        return 1;
                    }
                }
            ],
            0,
            ["harvest", "carryEnergyToLink"]
        );
        const carryMax = getBpNum(creep.memory.bodyparts, "carry") * 50;
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

    function ifMove() {
        const targetPos:
            | RoomPosition
            | {
                  pos: RoomPosition;
              } = global.creepMemory[creep.name].bundledPos || source;
        if (!creep.pos.isEqualTo(targetPos)) {
            creep.moveTo(targetPos, {
                visualizePathStyle: {
                    stroke: "#ffaa00"
                }
            });
        }
    }
}

function getGlobalMemory(creep: Creep) {
    if (!global.creepMemory[creep.name]) {
        global.creepMemory[creep.name] = {};
        setBundledPos(creep);
    }
}

function setBundledPos(creep: Creep) {
    const source = Game.getObjectById<Source>(creep.memory.task.sponsor as Id<Source>) as Source;
    global.creepMemory[creep.name].bundledPos = source.pos
        .findInRange(FIND_STRUCTURES, 1, {
            filter: structure => {
                return structure.structureType === STRUCTURE_CONTAINER;
            }
        })
        .pop()?.pos;
    global.creepMemory[creep.name].bundledLinkPos = source.pos
        .findInRange(FIND_STRUCTURES, 2, {
            filter: structure => {
                return structure.structureType === STRUCTURE_LINK;
            }
        })
        .pop()?.pos;
}
