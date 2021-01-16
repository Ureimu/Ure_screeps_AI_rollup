import { RoomPositionToStr } from "construction/utils/strToRoomPosition";
import bodypartsGenerator from "utils/bodypartsGenerator";
import findEx from "utils/findEx";

export function centerCarry(creep: Creep): void {
    if (!creep.memory.dontPullMe) creep.memory.dontPullMe = true;
    if (!global.creepMemory[creep.name]) global.creepMemory[creep.name] = {};
    const rts = new RoomPositionToStr(creep.room.name);
    if (!global.creepMemory[creep.name].bundledPos) {
        const center = rts.getPosFromStr(
            (creep.room.memory.constructionSchedule.gridLayout.creepWorkPos?.centerPos as string[])[0]
        );
        global.creepMemory[creep.name].bundledPos = center;
    }
    if (!global.creepMemory[creep.name].bundledLinkPos) {
        global.creepMemory[creep.name].bundledLinkPos = rts.getPosFromStr(
            creep.room.memory.construction.centerLink.pos[0]
        );
    }
    if (!global.creepMemory[creep.name].bundledStoragePos) {
        global.creepMemory[creep.name].bundledStoragePos = rts.getPosFromStr(
            creep.room.memory.construction.storage.pos[0]
        );
    }
    if (!global.creepMemory[creep.name].bundledLinkPos) {
        global.creepMemory[creep.name].bundledLinkPos = rts.getPosFromStr(
            creep.room.memory.construction.centerLink.pos[0]
        );
    } else {
        ifMove(creep);
        const storage: StructureStorage = findEx.lookForStructureByPos(
            global.creepMemory[creep.name].bundledStoragePos,
            STRUCTURE_STORAGE
        ) as StructureStorage;
        const link: StructureLink = findEx.lookForStructureByPos(
            global.creepMemory[creep.name].bundledLinkPos,
            STRUCTURE_LINK
        ) as StructureLink;
        let whatToDo = "harvest";
        const carryMax = bodypartsGenerator.getBpNum(creep.memory.task.spawnInf.bodyparts, "carry") * 50;
        if (link.store.energy === 0 && storage.store.energy > 100000) whatToDo = "carryEnergyToLink";
        switch (whatToDo) {
            case "carryEnergyToLink":
                if (creep.store.energy === carryMax) {
                    creep.transfer(link, "energy");
                } else {
                    creep.withdraw(storage, "energy");
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
