import { RoleSetting } from "./RoleSetting";
import { TaskSetting } from "./TaskSetting";

export interface TaskKindInfo {
    [key: string]: { targetRoomList: string[] };
}

export interface TaskGroupInfo {
    [key: string]: { targetRoom?: string; taskKind: string; startTime: number };
}

export class TaskGroupSetting {
    public roomName: string;
    public room: Room;
    public taskGroup: TaskGroupInfo;
    public constructor(room: Room) {
        this.roomName = room.name;
        this.room = room;
        this.taskGroup = Memory.rooms[this.roomName].taskGroup;
    }

    public getTaskGroupInfo(): TaskKindInfo {
        const info: TaskKindInfo = {};
        for (const taskGroupName in this.taskGroup) {
            const taskName = this.taskGroup[taskGroupName].taskKind;
            if (!info[taskName]) info[taskName] = { targetRoomList: [] };
            const targetRoomName = this.taskGroup[taskGroupName].targetRoom;
            if (targetRoomName) {
                info[taskName].targetRoomList.push(targetRoomName);
            }
        }
        return info;
    }

    public newSpawnTaskGroup(taskGroupName: string, targetRoomName: string): void {
        const roleSetting = new RoleSetting(this.room);
        roleSetting.newOutwardsTask(taskGroupName, targetRoomName);
        const roleTaskList = roleSetting.roleSettingList;
        for (const roleTaskName in roleTaskList[taskGroupName]) {
            const taskKindSetting = new TaskSetting(this.roomName, taskGroupName, roleTaskName);
            taskKindSetting.inits();
        }
    }

    public deleteSpawnTaskGroup(taskGroupName: string, targetRoomName: string): void {
        const roleSetting = new RoleSetting(this.room);
        roleSetting.deleteOutwardsTask(taskGroupName, targetRoomName);
        delete Memory.rooms[this.roomName].taskSetting[taskGroupName];
    }
}
