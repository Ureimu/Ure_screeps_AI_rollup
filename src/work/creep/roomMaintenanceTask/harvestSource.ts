import { getBpNum } from "utils/bodypartsGenerator";
import { lookForStructureByPos } from "utils/findEx";
import { stateCut } from "../utils/utils";

export function harvestSource(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    getGlobalMemory(creep);
    let source = <Source>Game.getObjectById(<Id<Source>>creep.memory.task.sponsor);
    if (!global.creepMemory[creep.name].bundledLinkPos) {
        ifMove(creep.harvest(source));
    } else {
        let container: StructureContainer = <StructureContainer>(
            lookForStructureByPos(global.creepMemory[creep.name].bundledPos, STRUCTURE_CONTAINER)
        );
        let link: StructureLink = <StructureLink>(
            lookForStructureByPos(global.creepMemory[creep.name].bundledLinkPos, STRUCTURE_LINK)
        );
        let state = stateCut(
            creep,
            [
                () => {
                    if(container.store["energy"]<2000){
                        return 0;
                    }else{
                        return 1;
                    }
                },
                () => {
                    if(link.store["energy"]==800){
                        return 0;
                    }else{
                        return 1;
                    }
                }
            ],
            0,
            ["harvest","carryEnergyToLink"]
        );
        let carryMax = getBpNum(creep.memory.bodyparts, "carry") * 50;
        switch (state) {
            case 0:
                ifMove(creep.harvest(source));
            case 1:
                if (creep.store["energy"] == carryMax) {
                    ifMove(creep.transfer(link, "energy"));
                } else {
                    ifMove(creep.withdraw(container, "energy"));
                }
                break;
            default:
                break;
        }
    }

    function ifMove(code: number) {
        if (
            !creep.pos.isEqualTo(
                global.creepMemory[creep.name].bundledPos ? global.creepMemory[creep.name].bundledPos : source
            )
        ) {
            creep.moveTo(
                global.creepMemory[creep.name].bundledPos ? global.creepMemory[creep.name].bundledPos : source,
                {
                    visualizePathStyle: {
                        stroke: "#ffaa00"
                    }
                }
            );
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
    let source = <Source>Game.getObjectById<Source>(<Id<Source>>creep.memory.task.sponsor);
    global.creepMemory[creep.name].bundledPos = source.pos
        .findInRange(FIND_STRUCTURES, 1, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        })
        .pop()?.pos;
    global.creepMemory[creep.name].bundledLinkPos = source.pos
        .findInRange(FIND_STRUCTURES, 2, {
            filter: structure => {
                return structure.structureType == STRUCTURE_LINK;
            }
        })
        .pop()?.pos;
}
