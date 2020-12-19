import { RoleSetting } from "task/taskClass/RoleSetting";
import { TaskSetting } from "task/taskClass/TaskSetting";

export function newSpawnTaskKind(room: Room, taskKindName: string, targetRoomName: string): void {
    const roleSetting = new RoleSetting(room);
    roleSetting.newOutwardsTask(taskKindName, targetRoomName);
    const roleTaskList = roleSetting.roleSettingList;
    for (const roleTaskName in roleTaskList[taskKindName]) {
        const taskKindSetting = new TaskSetting(room.name, taskKindName, roleTaskName);
        taskKindSetting.inits();
    }
}

export function deleteSpawnTaskKind(room: Room, taskKindName: string, targetRoomName: string): void {
    const roleSetting = new RoleSetting(room);
    roleSetting.deleteOutwardsTask(taskKindName, targetRoomName);
    delete Memory.rooms[room.name].taskSetting[taskKindName];
}
