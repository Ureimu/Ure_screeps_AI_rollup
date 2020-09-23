import { putContainerConstructionSites } from "./container";
import { putExtensionConstructionSites } from "./extension";
import { putRoadConstructionSites } from "./road";

export function autoConstruction() {
    for (let roomName in Memory.rooms) {
        if (Game.rooms[roomName].controller && Game.rooms[roomName].controller?.my) {
            let room = Game.rooms[roomName];
            switch ((Game.time - room.memory.constructionStartTime) % 50) {
                case 0:
                    if (
                        !room.memory.construction["roadToSource"] ||
                        room.memory.construction["roadToSource"].constructionSitesCompleted != true
                    ) {
                        putRoadConstructionSites(roomName);
                    }
                    break;
                case 1:
                    if (
                        !room.memory.construction["innerSourceContainer"] ||
                        (room.memory.construction["controllerSourceContainer"].constructionSitesCompleted != true ||
                            room.memory.construction["innerSourceContainer"].constructionSitesCompleted != true)
                    ) {
                        putContainerConstructionSites(roomName);
                    }
                    break;
                case 2:
                    if(!room.memory.construction["extension"]||room.memory.construction["extension"].constructionSitesCompleted != true){
                        putExtensionConstructionSites(roomName);
                    }
                default:
                    break;
            }//TODO 增加建筑阶段性检测。
        }
    }
}
