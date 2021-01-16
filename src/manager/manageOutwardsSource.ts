import { TaskGroupSetting } from "task/taskClass/TaskGroupSetting";
import * as profiler from "../../utils/profiler";

const manageOutwardsSource = function (room: Room): void {
    // 能够进入的房间列表
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
    const taskGroup = new TaskGroupSetting(room);
    const taskGroupInfo = taskGroup.getTaskGroupInfo();

    // 开新外矿
    for (const roomName of roomNameList) {
        if (roomName in taskGroupInfo) continue;
        const isControllerRoom = /(^[WE]\d*[1-9]+[NS]\d*[1-3|7-9]+$)|(^[WE]\d*[1-3|7-9]+[NS]\d*[1-9]+$)/.test(roomName);
        if (isControllerRoom && !Game.rooms[roomName].controller?.owner) {
            global.log(`[farm]  ${roomName} outwardsSource working`);
            taskGroup.newSpawnTaskGroup("outwardsSource", roomName);
        }
    }

    // 删除不用的外矿
    for (const roomName of taskGroupInfo.outwardsSource.targetRoomList) {
        if (Game.rooms[roomName].controller?.owner) {
            global.log(`[farm]  ${roomName} outwardsSource stopped,reason:房间已经被占领`);
            taskGroup.deleteSpawnTaskGroup("outwardsSource", roomName);
        }
        if (!(roomName in roomNameList)) {
            global.log(`[farm]  ${roomName} outwardsSource stopped,reason:房间已经无法进入`);
            taskGroup.deleteSpawnTaskGroup("outwardsSource", roomName);
        }
    }
};

export default profiler.registerFN(manageOutwardsSource, "manageOutwardsSource");
