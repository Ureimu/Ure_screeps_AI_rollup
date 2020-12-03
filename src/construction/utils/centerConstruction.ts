import { isStructureinPos } from "utils/findEx";
import { initConstructionScheduleMemory } from "./initConstructionMemory";
import { RoomPositionMemListToRoomPositionList } from "./putConstructionSites";
import { getPosfromStr, setPosToStr } from "./strToRoomPosition";

export function getCenterConstruction(room: Room) {
    initConstructionScheduleMemory(room, "center");
    if (room.controller) {
        if (!(Memory.rooms[room.name].constructionSchedule.center.centerPos?.length == 4)) {
            let lastpoint = Game.spawns[room.memory.firstSpawnName].pos;
            if (lastpoint) {
                console.log("[build] 未寻找建筑中心点，开始寻找。");
                let posList = getBlankDiagonalSquarePlace(lastpoint);
                Memory.rooms[room.name].constructionSchedule.center.centerPos = posList;
                return posList;
            } else {
                console.log("[build] 寻找建筑中心点时发生错误：没有firstSpawnName。");
                return [];
            }
        } else {
            console.log("[build] 使用已寻找到的中心点作为中心布局");
            return <RoomPositionStr[]>Memory.rooms[room.name].constructionSchedule.center.centerPos;
        }
    } else {
        console.log("[build] 寻找建筑中心点时发生错误：房间没有controller。");
        return [];
    }
}

export function getBlankDiagonalSquarePlace(point: RoomPosition) {
    let lastpoint = point;
    //计算扩张一格后的正方形的所有位置
    let squareExpandStrList: RoomPositionStr[] = [];
    let squareExpandPosList: RoomPosition[] = [];
    lastpoint.getSquare().forEach(pos => {
        squareExpandStrList.push(setPosToStr(pos));
    });
    let squareExpand = new Set(squareExpandStrList);
    let ExpandList: RoomPosition[] = [];
    //扩张3次，最终正方形的边长为9
    for(let i = 0 ; i<3;i++){
        squareExpand.forEach((posStr: RoomPositionStr) => {
            getPosfromStr(posStr)
                .getSquare()
                .forEach((posE: RoomPosition) => {
                    ExpandList.push(posE);
                });
        });
        ExpandList.forEach(pos => {
            squareExpand.add(setPosToStr(pos));
        });
        ExpandList = [];
    }
    squareExpand.forEach((posStr: RoomPositionStr) => {
        squareExpandPosList.push(getPosfromStr(posStr));
    });
    //计算中心位置
    let axis = [
        [0,1],
        [1,0],
        [0,-1],
        [-1,0]
    ]

    let centerPos: RoomPosition[] = [];
    for (let pos of squareExpandPosList) {
        let rectPosList: RoomPosition[] = [];
        for (let j = 0; j < 4; j++) {
            let m = new RoomPosition(
                pos.x + axis[j][0],
                pos.y + axis[j][1],
                pos.roomName
            );
            let x = m.lookFor(LOOK_STRUCTURES);
            let terrain: Terrain[] = m.lookFor(LOOK_TERRAIN);
            if (x.length != 0 || terrain[0] == "wall") {
                //if (!isStructureinPos(x, STRUCTURE_ROAD)) {
                rectPosList.splice(0);
                break;
                //}
            }
            rectPosList.push(m);
        }
        if (rectPosList.length == 4) {
            centerPos = rectPosList;
            break;
        }
    }

    if (centerPos.length == 0) {
        console.log("[build] 无法确定中心布局位置。");
    }else{
        console.log("[build] 已经确定中心布局位置。");
    }
    let posStrList:RoomPositionStr[] = [];
    centerPos.forEach((pos)=>{posStrList.push(setPosToStr(pos))})
    return posStrList;
}
