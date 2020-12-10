import { getPosCoordFromStr, getPosFromStr } from "construction/utils/strToRoomPosition";
import { getBpNum } from "utils/bodypartsGenerator";
import { lookForStructureByPos } from "utils/findEx";

export function centerCarry(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    if (!global.creepMemory[creep.name]) global.creepMemory[creep.name] = {};
    if (!global.creepMemory[creep.name].bundledPos)
        global.creepMemory[creep.name].bundledPos = new RoomPosition(
            (getPosCoordFromStr(creep.room.memory.construction.centerLink.pos[0]).x +
                getPosCoordFromStr(creep.room.memory.construction.factory.pos[0]).x +
                getPosCoordFromStr(creep.room.memory.construction.terminal.pos[0]).x +
                getPosCoordFromStr(creep.room.memory.construction.storage.pos[0]).x) /
                4,
            (getPosCoordFromStr(creep.room.memory.construction.centerLink.pos[0]).y +
                getPosCoordFromStr(creep.room.memory.construction.factory.pos[0]).y +
                getPosCoordFromStr(creep.room.memory.construction.terminal.pos[0]).y +
                getPosCoordFromStr(creep.room.memory.construction.storage.pos[0]).y) /
                4,
            creep.room.name
        );
    if (!global.creepMemory[creep.name].bundledLinkPos) {
        global.creepMemory[creep.name].bundledLinkPos = getPosFromStr(creep.room.memory.construction.centerLink.pos[0]);
    }
    if (!global.creepMemory[creep.name].bundledStoragePos) {
        global.creepMemory[creep.name].bundledStoragePos = getPosFromStr(creep.room.memory.construction.storage.pos[0]);
    }
    if (!global.creepMemory[creep.name].bundledLinkPos) {
        global.creepMemory[creep.name].bundledLinkPos = getPosFromStr(creep.room.memory.construction.centerLink.pos[0]);
    } else {
        ifMove(creep);
        const storage: StructureStorage = lookForStructureByPos(
            global.creepMemory[creep.name].bundledStoragePos,
            STRUCTURE_STORAGE
        ) as StructureStorage;
        const link: StructureLink = lookForStructureByPos(
            global.creepMemory[creep.name].bundledLinkPos,
            STRUCTURE_LINK
        ) as StructureLink;
        let whatToDo = "harvest";
        const carryMax = getBpNum(creep.memory.bodyparts, "carry") * 50;
        if (link.store.energy > 0) whatToDo = "carryEnergyToLink";
        switch (whatToDo) {
            case "carryEnergyToLink":
                if (creep.store.energy === carryMax) {
                    creep.transfer(storage, "energy");
                } else {
                    creep.withdraw(link, "energy");
                }
                break;
            case "harvest":
            default:
                break;
        }
    }
}

function ifMove(creep: Creep) {
    if (!creep.pos.isEqualTo(global.creepMemory[creep.name].bundledPos as RoomPosition)) {
        creep.moveTo(global.creepMemory[creep.name].bundledPos as RoomPosition, {
            visualizePathStyle: {
                stroke: "#ffaa00"
            }
        });
    }
}
