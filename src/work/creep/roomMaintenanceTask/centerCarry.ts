import { getPosCoordfromStr, getPosfromStr } from "construction/utils/strToRoomPosition";
import { getBpNum } from "utils/bodypartsGenerator";
import { lookForStructureByPos } from "utils/findEx";

export function centerCarry(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    if(!global.creepMemory[creep.name])global.creepMemory[creep.name]={}
    if (!global.creepMemory[creep.name].bundledPos)
        global.creepMemory[creep.name].bundledPos = new RoomPosition(
            (getPosCoordfromStr(creep.room.memory.construction["centerLink"].pos[0]).x +
                getPosCoordfromStr(creep.room.memory.construction["factory"].pos[0]).x +
                getPosCoordfromStr(creep.room.memory.construction["terminal"].pos[0]).x +
                getPosCoordfromStr(creep.room.memory.construction["storage"].pos[0]).x) /
                4,
            (getPosCoordfromStr(creep.room.memory.construction["centerLink"].pos[0]).y +
                getPosCoordfromStr(creep.room.memory.construction["factory"].pos[0]).y +
                getPosCoordfromStr(creep.room.memory.construction["terminal"].pos[0]).y +
                getPosCoordfromStr(creep.room.memory.construction["storage"].pos[0]).y) /
                4,creep.room.name
        );
    if(!global.creepMemory[creep.name].bundledLinkPos){
        global.creepMemory[creep.name].bundledLinkPos=getPosfromStr(creep.room.memory.construction["centerLink"].pos[0]);
    }
    if(!global.creepMemory[creep.name].bundledStoragePos){
        global.creepMemory[creep.name].bundledStoragePos=getPosfromStr(creep.room.memory.construction["storage"].pos[0]);
    }
    if (!global.creepMemory[creep.name].bundledLinkPos) {
    } else {
        let storage: StructureStorage =  <StructureStorage>(
            lookForStructureByPos(global.creepMemory[creep.name].bundledStoragePos, STRUCTURE_STORAGE)
        );
        let link: StructureLink = <StructureLink>(
            lookForStructureByPos(global.creepMemory[creep.name].bundledLinkPos, STRUCTURE_LINK)
        );
        let whatToDo = "harvest";
        let carryMax = getBpNum(creep.memory.bodyparts, "carry") * 50;
        if (link.store["energy"] > 0) whatToDo = "carryEnergyToLink";
        switch (whatToDo) {
            case "carryEnergyToLink":
                if (creep.store["energy"] == carryMax) {
                    ifMove(creep.transfer(storage, "energy"));
                } else {
                    ifMove(creep.withdraw(link, "energy"));
                }
                break;
            case "harvest":
            default:
                break;
        }
    }

    function ifMove(code: number) {
        if (
            !creep.pos.isEqualTo(
                global.creepMemory[creep.name].bundledPos
            )
        ) {
            creep.moveTo(
                global.creepMemory[creep.name].bundledPos,
                {
                    visualizePathStyle: {
                        stroke: "#ffaa00"
                    }
                }
            );
        }
    }
}
