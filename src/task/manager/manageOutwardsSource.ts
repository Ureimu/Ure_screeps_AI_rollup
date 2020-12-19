import { newSpawnTaskKind } from "task/spawnTask";
import * as profiler from "../../../utils/profiler";

const manageOutwardsSource = function (room: Room): void {
    // 为innerRoomTaskSet执行的函数
    const roomName = "W7N7";
    const isControllerRoom = /(^[WE]\d*[1-9]+[NS]\d*[1-3|7-9]+$)|(^[WE]\d*[1-3|7-9]+[NS]\d*[1-9]+$)/.test(roomName);
    if (isControllerRoom) {
        console.log(`${roomName} working`);
        newSpawnTaskKind(room, "outwardsSource", roomName);
    }
};

profiler.registerFN(manageOutwardsSource, "manageOutwardsSource");
export default manageOutwardsSource;
