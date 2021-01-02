import { newSpawnTaskKind } from "task/spawnTask";
import * as profiler from "../../../utils/profiler";

const manageOutwardsSource = function (room: Room): void {
    const roomNameList: string[] = [];
    const exits = Game.map.describeExits(room.name) as { [name: string]: string };
    for (const direction in exits) {
        // console.log(Game.map.getRoomStatus(exits[direction]).status);
        if (Game.map.getRoomStatus(exits[direction]).status === Game.map.getRoomStatus(room.name).status) {
            roomNameList.push(exits[direction]);
        }
    }
    // console.log(roomNameList.toString());
    // 为innerRoomTaskSet执行的函数
    for (const roomName of roomNameList) {
        const isControllerRoom = /(^[WE]\d*[1-9]+[NS]\d*[1-3|7-9]+$)|(^[WE]\d*[1-3|7-9]+[NS]\d*[1-9]+$)/.test(roomName);
        if (isControllerRoom) {
            console.log(`[farm]  ${roomName} outwardsSource working`);
            newSpawnTaskKind(room, "outwardsSource", roomName);
        }
    }
};

export default profiler.registerFN(manageOutwardsSource, "manageOutwardsSource");
