import { getPosFromStr } from "construction/utils/strToRoomPosition";

export function lookForStructure(
    room: Room,
    structureName: string,
    storable = false
): AnyStructure[] | AnyStoreStructure[] | undefined {
    const posList = lookForStructurePos(room, structureName);
    if (typeof posList === "undefined") return;
    const structureList = [];
    if (storable) {
        for (const pos of posList) {
            for (const i of pos.lookFor(LOOK_STRUCTURES)) {
                if (i.structureType === room.memory.construction[structureName].structureType) {
                    const x = Game.getObjectById(i.id) as AnyStoreStructure;
                    if (x.store) {
                        structureList.push(x);
                    }
                }
            }
        }
        return structureList;
    } else {
        for (const pos of posList) {
            for (const i of pos.lookFor(LOOK_STRUCTURES)) {
                if (i.structureType === room.memory.construction[structureName].structureType) {
                    structureList.push(Game.getObjectById(i.id) as AnyStructure);
                }
            }
        }
        return structureList;
    }
}

// 不建议在寻找某pos上的所有建筑时使用此函数！请直接使用lookFor(LOOK_STRUCTURES)
export function lookForStructureByPos<T extends StructureConstant>(
    pos: RoomPosition | undefined,
    structureType: T
): ConcreteStructure<T> | undefined {
    if (typeof pos === "undefined") return;
    for (const i of pos.lookFor(LOOK_STRUCTURES)) {
        if (i.structureType === structureType) {
            return Game.getObjectById<ConcreteStructure<T>>(i.id as Id<ConcreteStructure<T>>) as ConcreteStructure<T>;
        }
    }
    return;
}

export function lookForStructurePos(room: Room, structureName: string): RoomPosition[] | undefined {
    if (!!room.memory.construction[structureName] && !!room.memory.construction[structureName].pos[0]) {
        const posList = [];
        for (const posStr of room.memory.construction[structureName].pos) {
            const pos = getPosFromStr(posStr);
            posList.push(pos);
        }
        return posList;
    } else {
        return;
    }
}

export function lookForStructureName(structure?: AnyStructure | null): string {
    if (!structure) {
        return "";
    }
    for (const con in structure.room.memory.construction) {
        const m: { [name: string]: constructionSitesInf } = structure.room.memory.construction;
        if (m[con].structureType === structure.structureType) {
            for (const nStr of m[con].pos) {
                const n = getPosFromStr(nStr);
                if (isPosEqual(n, structure.pos)) {
                    return con;
                }
            }
        }
    }
    return "";
}

export function isPosEqual(pos1: RoomPosition | RoomPositionMem, pos2: RoomPosition | RoomPositionMem): boolean {
    if (pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName) {
        return true;
    }
    return false;
}

type structureInfoList = {
    [name: string]: any;
}[];

export function getStructureFromArray(
    room: Room,
    StructureArray: structureInfoList
): {
    [name: string]: AnyStoreStructure[];
}[] {
    const structureList: { [name: string]: AnyStoreStructure[] }[] = []; // 解析给定条件并转换为对应对象数组
    for (const st1 of StructureArray) {
        structureList.unshift({});
        for (const st2 in st1) {
            const m = lookForStructure(room, st2) as AnyStoreStructure[];
            const x = typeof m !== "undefined" ? m : [];
            structureList[0][st2] = x;
        }
    }
    structureList.reverse();
    return structureList;
}

export function isStructureInPos(
    structures: Structure<StructureConstant>[],
    structureType: StructureConstant
): boolean {
    for (const structure of structures) {
        if (structure.structureType === structureType) {
            return true;
        }
    }
    return false;
}
