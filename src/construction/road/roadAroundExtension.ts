import { initConstructionScheduleMemory, initConstructionMemory } from "construction/utils/initConstructionMemory";
import { putConstructionSites } from "construction/utils/putConstructionSites";
import { getPosfromStr, setPosToStr } from "construction/utils/strToRoomPosition";
import { isStructureinPos } from "utils/findEx";

export function roadAroundExtension(room: Room) {
    initConstructionScheduleMemory(room, "roadAroundExtension");
    initConstructionMemory(room, "roadAroundExtension", STRUCTURE_ROAD);
    let roadExpandStrList:RoomPositionStr[] = [];
    Game.spawns[room.memory.firstSpawnName].pos.getDiagSquare().forEach((pos)=>{roadExpandStrList.push(setPosToStr(pos))})
    let roadExpand = new Set(roadExpandStrList);
    let extensionExpand = new Set([setPosToStr(Game.spawns[room.memory.firstSpawnName].pos)]);
    let ifContinue = true;
    let i = 1;
    room.memory.construction["roadAroundExtension"].memory.extensionExpand = [];
    while (ifContinue) {
        //进行一次扩张，会增加4n-4个空位(n>2)
        let ExpandList: RoomPosition[] = [];
        roadExpand.forEach((posStr: RoomPositionStr) => {
            getPosfromStr(posStr).getQuadSquare().forEach((posE: RoomPosition) => {
                ExpandList.push(posE);
            });
        });
        ExpandList.forEach(pos => {
            roadExpand.add(setPosToStr(pos));
        });
        ExpandList = [];
        extensionExpand.forEach((posStr: RoomPositionStr) => {
            getPosfromStr(posStr).getQuadSquare().forEach((posE: RoomPosition) => {
                ExpandList.push(posE);
            });
        });
        ExpandList.forEach(pos => {
            extensionExpand.add(setPosToStr(pos));
        });
        i++;
        //_判断实际可用空位数量
        //__判断是否可以放下road，不可以则弹出集合
        for (let roadExpandPosStr of roadExpand) {
            let roadExpandPos = getPosfromStr(roadExpandPosStr)
            let structures = roadExpandPos.lookFor(LOOK_STRUCTURES);
            let terrain: Terrain[] = roadExpandPos.lookFor(LOOK_TERRAIN);
            if (structures.length != 0 || terrain[0] != "plain") {
                if (!isStructureinPos(structures, STRUCTURE_ROAD)) {
                    roadExpand.delete(setPosToStr(roadExpandPos));
                }
            }
        }
        //__判断是否可以放下extension，不可以则弹出集合
        for (let extensionExpandPosStr of extensionExpand) {
            let extensionExpandPos =  getPosfromStr(extensionExpandPosStr)
            let structures = extensionExpandPos.lookFor(LOOK_STRUCTURES);
            let terrain: Terrain[] = extensionExpandPos.lookFor(LOOK_TERRAIN);
            if (structures.length != 0 || terrain[0] == "wall") {
                if (!isStructureinPos(structures, STRUCTURE_EXTENSION)) {
                    extensionExpand.delete(setPosToStr(extensionExpandPos));
                }
            }
        }
        //__判断是否extension周围还有路，没有则弹出集合
        for (let extensionExpandPosStr of extensionExpand) {
            let extensionExpandPos = getPosfromStr(extensionExpandPosStr)
            let extensionExpandPosAround = extensionExpandPos.getSquare();
            let j = 0;
            for (let extensionExpandPosAroundPos of extensionExpandPosAround) {
                let structures = extensionExpandPosAroundPos.lookFor(LOOK_STRUCTURES);
                let terrain: Terrain[] = extensionExpandPosAroundPos.lookFor(LOOK_TERRAIN);
                if (
                    terrain[0] == "wall" ||
                    (!isPosSetinPos(roadExpand, setPosToStr(extensionExpandPosAroundPos)) &&
                    !isStructureinPos(structures, STRUCTURE_ROAD))
                ) {
                    j++;
                }
            }
            if (j == 8) {
                extensionExpand.delete(setPosToStr(extensionExpandPos));
            }
        }
        //__判断是否路周围还有extension，没有则放弃(暂时不使用)
        //判断extension数量是否足够
        console.log(extensionExpand.size);
        if (CONTROLLER_STRUCTURES.extension[room.controller?.level as number] <= extensionExpand.size) {
            ifContinue = false;
        }
    }
    //_生成extension放置位置数组
    let extensionPosList: RoomPosition[] = [];
    extensionExpand.forEach((posStr: RoomPositionStr) => {
        extensionPosList.push(getPosfromStr(posStr));
    });
    if (!room.memory.construction["extension"]) initConstructionMemory(room, "extension", STRUCTURE_EXTENSION);
    room.memory.construction["extension"].memory.calculatedPosList = [];
    extensionPosList.forEach((pos)=>{room.memory.construction["extension"].memory.calculatedPosList?.push(setPosToStr(pos))})
    //_生成road数组
    let roadPosList: RoomPosition[] = [];
    roadExpand.forEach((posStr: RoomPositionStr) => {
        roadPosList.push(getPosfromStr(posStr));
    });
    putConstructionSites(room, roadPosList, "roadAroundExtension", STRUCTURE_ROAD);
    room.memory.construction["roadAroundExtension"].constructionSitesCompleted = true;
}

function isPosSetinPos(posSet: Set<string>, pos: RoomPositionStr): boolean {
    for (let posSetposStr of posSet) {
        if (posSetposStr == pos) {
            return true;
        }
    }
    return false;
}
