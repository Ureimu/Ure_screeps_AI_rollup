import { newSpawnTaskKind } from "task/spawnTask";
import * as profiler from "../../../utils/profiler";

const manageOutwardsSource = function (room: Room): void {
    // 为innerRoomTaskSet执行的函数
    const roomNameList: string[] = ["W1N2", "W2N1", "W2N3"]; // "W9N7", "W8N6", "W7N7" "W1N2", "W2N1", "W2N3"
    for (const roomName of roomNameList) {
        const isControllerRoom = /(^[WE]\d*[1-9]+[NS]\d*[1-3|7-9]+$)|(^[WE]\d*[1-3|7-9]+[NS]\d*[1-9]+$)/.test(roomName);
        if (isControllerRoom) {
            console.log(`[farm]  ${roomName} outwardsSource working`);
            newSpawnTaskKind(room, "outwardsSource", roomName);
        }
    }
};

export default profiler.registerFN(manageOutwardsSource, "manageOutwardsSource");
