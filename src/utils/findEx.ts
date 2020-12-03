import { getPosfromStr } from "construction/utils/strToRoomPosition";

export function lookForStructure(
    room: Room,
    structureName: string,
    storeable: boolean = false
): AnyStructure[] | AnyStoreStructure[] | undefined {
    let pos = lookForStructurePos(room, structureName);
    if (typeof pos === "undefined") return;
    let stlist = [];
    if (storeable) {
        for (let npos of pos) {
            for (let i of npos.lookFor(LOOK_STRUCTURES)) {
                if (i.structureType == room.memory.construction[structureName].structureType) {
                    let x = <AnyStoreStructure>Game.getObjectById(i.id);
                    if (!!x.store) {
                        stlist.push(x);
                    }
                }
            }
        }
        return stlist;
    } else {
        for (let npos of pos) {
            for (let i of npos.lookFor(LOOK_STRUCTURES)) {
                if (i.structureType == room.memory.construction[structureName].structureType) {
                    stlist.push(<AnyStructure>Game.getObjectById(i.id));
                }
            }
        }
        return stlist;
    }
}

//不建议在寻找某pos上的所有建筑时使用此函数！请直接使用lookFor(LOOK_STRUCTURES)
export function lookForStructureByPos(
    pos: RoomPosition | undefined,
    structureType: StructureConstant,
    storeable: boolean = false
): AnyStructure | AnyStoreStructure | undefined {
    if (typeof pos === "undefined") return;
    if (!storeable) {
        for (let i of pos.lookFor(LOOK_STRUCTURES)) {
            if (i.structureType == structureType) {
                return <AnyStructure>Game.getObjectById(i.id);
            }
        }
    } else {
        for (let i of pos.lookFor(LOOK_STRUCTURES)) {
            if (i.structureType == structureType) {
                let x = <AnyStoreStructure>Game.getObjectById(i.id);
                if (!!x.store) {
                    return x;
                } else {
                    return;
                }
            }
        }
    }
    return;
}

export function lookForStructurePos(room: Room, structureName: string): RoomPosition[] | undefined {
    if (!!room.memory.construction[structureName] && !!room.memory.construction[structureName].pos[0]) {
        let posList = [];
        for (let posStr of room.memory.construction[structureName].pos) {
            let npos = getPosfromStr(posStr)
            let Pos = new RoomPosition(npos.x, npos.y, npos.roomName);
            posList.push(Pos);
        }
        return posList;
    } else {
        return;
    }
}

export function lookForStructureName(structure?: AnyStructure|null): string {
    if (!structure) {
        return "";
    }
    for (let con in structure.room.memory.construction) {
        let m: { [name: string]: constructionSitesInf } = structure.room.memory.construction;
        if (m[con].structureType == structure.structureType) {
            for (let nStr of m[con].pos) {
                let n = getPosfromStr(nStr)
                if (isPosEqual(n, structure.pos)) {
                    return con;
                }
            }
        }
    }
    return "";
}

export function isPosEqual(pos1: RoomPosition|RoomPositionMem, pos2: RoomPosition|RoomPositionMem) {
    if (pos1.x == pos2.x && pos1.y == pos2.y && pos1.roomName == pos2.roomName) {
        return true;
    }
    return false;
}

type structureInfoList = Array<{
    [name: string]: any;
}>;

export function getStructureFromArray(room:Room,StructureArray: structureInfoList) {
    let structureList: Array<{ [name: string]: AnyStoreStructure[]; }> = []; //解析给定条件并转换为对应对象数组
    for (let st1 of StructureArray) {
        structureList.unshift({});
        for (let st2 in st1) {
            let m = <AnyStoreStructure[]>lookForStructure(room, st2);
            let x = (typeof m !== "undefined") ? m : [];
            structureList[0][st2] = x;
        }
    }
    structureList.reverse();
    return structureList;
}

export function isStructureinPos(structures: Structure<StructureConstant>[], structureType: StructureConstant): boolean {
    for (let structure of structures) {
        if (structure.structureType == structureType) {
            return true;
        }
    }
    return false;
}
