import { RoomTask } from "task/utils/RoomTask";
import * as profiler from "../../../utils/profiler";

const manageTask = function (room: Room): void {
    // Automatically delete memory of missing creeps
    if ((Game.time - 4) % global.workRate.manageTask !== 0) return; // 在spawn执行任务之前运行
    for (const taskName in Memory.rooms[room.name].innerRoomTaskSet) {
        const roomTask = new RoomTask(room.name, taskName);
        if (taskName === "centerCarry" && (room.controller?.level as number) >= 6 && roomTask.hasPushed === true) {
            roomTask.hasPushed = false;
        }
    }
};

profiler.registerFN(manageTask, "manageTask");
export default manageTask;
