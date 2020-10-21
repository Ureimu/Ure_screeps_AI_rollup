import { putContainerConstructionSites } from "./container";
import { putExtensionConstructionSites } from "./extension";
import { putRoadConstructionSites } from "./road";
import { putTowerConstructionSites } from "./tower";

export function autoConstruction() {
    for (let roomName in Memory.rooms) {
        if (!!Game.rooms[roomName] && Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            let room = Game.rooms[roomName];
            if(room.memory.roomControlLevel != room.controller?.level){
                for(let m in room.memory.construction){
                    room.memory.construction[m].constructionSitesCompleted=false;
                }
            }
            room.memory.roomControlLevel = <number>room.controller?.level;
            switch ((Game.time - room.memory.constructionStartTime) % 100) {
                case 10:
                    if (
                        !room.memory.construction["roadToSource"] ||
                        room.memory.construction["roadToSource"].constructionSitesCompleted != true
                    ) {
                        putRoadConstructionSites(roomName);
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
                default:
                    break;
            }//TODO 增加建筑阶段性检测。
        }
    }
}
