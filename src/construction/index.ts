import { putContainerConstructionSites } from "./container";
import { putRoadConstructionSites } from "./road";

export function autoConstruction() {
    if (Game.time % 50 != 0) return;
    for (let roomName in Memory.rooms) {
        let room = Game.rooms[roomName];
        if(!room.memory.construction["roadToSource"]){
            putRoadConstructionSites(roomName);
            putContainerConstructionSites(roomName);
        }
        if (room.memory.construction["roadToSource"].constructionSitesCompleted != true) {
            putRoadConstructionSites(roomName);
        }
        if (room.memory.construction["controllerSourceContainer"].constructionSitesCompleted != true ||
        room.memory.construction["innerSourceContainer"].constructionSitesCompleted != true) {
            putContainerConstructionSites(roomName);
        }
    }
}
