import { newSpawnTaskKind } from "task/spawnTask";
import * as profiler from "../../../utils/profiler";

const manageOutwardsSource = function (room: Room): void {
    const roomNameList: string[] = [];
    const exits = Game.map.describeExits(room.name) as { [name: string]: string };
    for (const direction in exits) {
        // 判断是否在私服，如果在私服则Game.map.getRoomStatus会抛出错误
        if (!Game.cpu.generatePixel) {
            roomNameList.push(exits[direction]);
        } else {
            if (Game.map.getRoomStatus(exits[direction]).status === Game.map.getRoomStatus(room.name).status) {
                roomNameList.push(exits[direction]);
            }
        }
        // global.log(Game.map.getRoomStatus(exits[direction]).status);
    }
    // global.log(roomNameList.toString());
    // 为innerRoomTaskSet执行的函数
    for (const roomName of roomNameList) {
        const isControllerRoom = /(^[WE]\d*[1-9]+[NS]\d*[1-3|7-9]+$)|(^[WE]\d*[1-3|7-9]+[NS]\d*[1-9]+$)/.test(roomName);
        if (isControllerRoom) {
            global.log(`[farm]  ${roomName} outwardsSource working`);
            newSpawnTaskKind(room, "outwardsSource", roomName);
        }
    }
};

export default profiler.registerFN(manageOutwardsSource, "manageOutwardsSource");
