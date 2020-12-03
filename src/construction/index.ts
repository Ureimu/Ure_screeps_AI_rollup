import { getGridLayout } from "./composition/gridLayout";
import { runLayout } from "./composition/runLayOut";

export function autoConstruction(room:Room) {
    if(room.memory.roomControlStatus[0] != room.controller?.level){
        for(let m in room.memory.construction){
            room.memory.construction[m].constructionSitesCompleted=false;
        }
        console.log("[build] 房间等级提升，重新检查建筑数量")
        //FIXME 1.不停推pos导致内存溢出 fixed 2.由于下面的原因导致的find失灵
        /** 原因大概是RoomPosition在转化为memory字符串后丢失了原来的对象属性，需要在使用memory时重新转换为RoomPosition对象 */
    }
    room.memory.roomControlStatus[0] = <number>room.controller?.level;
    room.memory.roomControlStatus[1] = <number>room.controller?.progress;
    room.memory.roomControlStatus[2] = <number>room.controller?.progressTotal;
    if(Game.time%100==0) runLayout(room,"gridLayout",getGridLayout);
}
