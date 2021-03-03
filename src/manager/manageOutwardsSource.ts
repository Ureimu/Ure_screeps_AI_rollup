import { TaskGroupSetting } from "task/taskClass/TaskGroupSetting";
import * as profiler from "../../utils/profiler";

const MaxSourceRoomNumber = 4;

/**
 * 判断给定的房间是否可以进入，并且在可以进入的时候将该房间名放入返回的列表。
 *
 * @param {string} roomName
 * @returns {string[]}
 */
function getAvailableNearbyRooms(roomName: string): string[] {
    const availableRoomNameList: string[] = [];
    const exits = Game.map.describeExits(roomName) as { [name: string]: string };
    for (const direction in exits) {
        // 判断是否在私服，如果在私服则Game.map.getRoomStatus会抛出错误
        if (!Game.cpu.generatePixel) {
            availableRoomNameList.push(exits[direction]);
        } else {
            if (Game.map.getRoomStatus(exits[direction]).status === Game.map.getRoomStatus(roomName).status) {
                availableRoomNameList.push(exits[direction]);
            }
        }
        // global.log(Game.map.getRoomStatus(exits[direction]).status);
    }
    return availableRoomNameList;
}

const manageOutwardsSource = function (room: Room): void {
    // 能够进入的房间列表
    const availableRoomNameSet = new Set(getAvailableNearbyRooms(room.name));
    let expandedRoomNameList: string[] = [];
    for (const roomName of availableRoomNameSet) {
        if (Game.rooms[roomName]) {
            expandedRoomNameList = expandedRoomNameList.concat(getAvailableNearbyRooms(roomName));
        }
    }
    expandedRoomNameList.forEach(roomName => availableRoomNameSet.add(roomName));
    const availableRoomNameList = Array.from(availableRoomNameSet);
    // global.log(roomNameList.toString());

    // 为innerRoomTaskSet执行的函数
    const taskGroup = new TaskGroupSetting(room);
    const taskGroupInfo = taskGroup.getTaskGroupInfo();
    global.log(`taskGroupInfo:${JSON.stringify(taskGroupInfo)}`);

    // 开新外矿
    for (const roomName of availableRoomNameSet) {
        const targetRoomList = taskGroupInfo.outwardsSource?.targetRoomList;
        if (targetRoomList?.length > MaxSourceRoomNumber || targetRoomList?.some(name => name === roomName)) continue;
        const isControllerRoom = /(^[WE]\d*[1-9]+[NS]\d*[1-3|7-9]+$)|(^[WE]\d*[1-3|7-9]+[NS]\d*[1-9]+$)/.test(roomName);
        if (isControllerRoom && !Game.rooms[roomName]?.controller?.owner) {
            global.log(`[farm]  ${roomName} outwardsSource starting`);
            taskGroup.newSpawnTaskGroup("outwardsSource", roomName);
        }
    }

    // 删除不用的外矿
    global.log(`availableRoomNameList:${availableRoomNameList.toString()}`);
    if (taskGroupInfo.outwardsSource?.targetRoomList) {
        for (const roomName of taskGroupInfo.outwardsSource?.targetRoomList) {
            if (Game.rooms[roomName]?.controller?.owner) {
                global.log(`[farm]  ${roomName} outwardsSource stopped,reason:房间已经被占领`);
                taskGroup.deleteSpawnTaskGroup("outwardsSource", roomName);
            }
            if (availableRoomNameList.every(name => name !== roomName)) {
                global.log(`[farm]  ${roomName} outwardsSource stopped,reason:房间已经无法进入`);
                taskGroup.deleteSpawnTaskGroup("outwardsSource", roomName);
            }
            if (availableRoomNameList?.length > MaxSourceRoomNumber) {
                global.log(`[farm]  ${roomName} outwardsSource stopped,reason:房间数量超过设定限制`);
                taskGroup.deleteSpawnTaskGroup("outwardsSource", roomName);
            }
        }
    }
};

export default profiler.registerFN(manageOutwardsSource, "manageOutwardsSource");
