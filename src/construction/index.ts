import { putContainerConstructionSites } from "./container";
import { putExtensionConstructionSites } from "./extension";
import { putRampartConstructionSites } from "./ramparts";
import { putRoadConstructionSites } from "./road";
import { putStorageConstructionSites } from "./storage";
import { putTowerConstructionSites } from "./tower";

export function autoConstruction(room:Room) {
    let roomName = room.name;
    if(room.memory.roomControlStatus[0] != room.controller?.level){
        for(let m in room.memory.construction){
            room.memory.construction[m].constructionSitesCompleted=false;
        }
        console.log("[build] 房间等级提升，重新检查建筑数量")
        //TODO FIX 1.不停推pos导致内存溢出 fixed 2.由于下面的原因导致的find失灵
        /** 原因大概是RoomPosition在转化为memory字符串后丢失了原来的对象属性，需要在使用memory时重新转换为RoomPosition对象 */
    }
    room.memory.roomControlStatus[0] = <number>room.controller?.level;
    room.memory.roomControlStatus[1] = <number>room.controller?.progress;
    room.memory.roomControlStatus[2] = <number>room.controller?.progressTotal;
    switch ((Game.time - room.memory.constructionStartTime) % 100) {
        case 10:
            if (
                !room.memory.construction["roadAroundExtension"] ||
                room.memory.construction["roadAroundExtension"].constructionSitesCompleted != true
            ) {
                putRoadConstructionSites(roomName,[]);
            }
            break;
        case 11:
            if (
                !room.memory.construction["innerSourceContainer"] ||
                (room.memory.construction["controllerSourceContainer"].constructionSitesCompleted != true ||
                    room.memory.construction["innerSourceContainer"].constructionSitesCompleted != true)
            ) {
                putContainerConstructionSites(roomName);
            }
            break;
        case 12:
            if(!room.memory.construction["extension"]||room.memory.construction["extension"].constructionSitesCompleted != true){
                putExtensionConstructionSites(roomName);
            }
            break;
        case 13:
            if(!room.memory.construction["tower"]||room.memory.construction["tower"].constructionSitesCompleted != true){
                putTowerConstructionSites(roomName);
            }
        case 14:
            if(room.memory.roomControlStatus[0]>3&&(!room.memory.construction["rampart"]||room.memory.construction["rampart"].constructionSitesCompleted != true)){
                putRampartConstructionSites(room);
            }
        case 15:
            if(room.memory.roomControlStatus[0]>3&&(!room.memory.construction["storage"]||room.memory.construction["storage"].constructionSitesCompleted != true)){
                putStorageConstructionSites(room);
            }
        default:
            break;
    }//TODO 增加建筑阶段性检测。
}
