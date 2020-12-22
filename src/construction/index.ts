import { getGridLayout } from "./composition/gridLayout";
import { runLayout } from "./composition/runLayOut";

export function autoConstruction(room: Room): void {
    if (room.memory.roomControlStatus[0] !== room.controller?.level) {
        for (const m in room.memory.construction) {
            room.memory.construction[m].constructionSitesCompleted = false;
        }
        console.log("[build] 房间等级提升，重新检查建筑数量");
    }
    room.memory.roomControlStatus[0] = room.controller?.level as number;
    room.memory.roomControlStatus[1] = room.controller?.progress as number;
    room.memory.roomControlStatus[2] = room.controller?.progressTotal as number;
    if ((Game.time - room.memory.startTime) % global.workRate.construction === 0)
        runLayout(room, "gridLayout", getGridLayout);
}
