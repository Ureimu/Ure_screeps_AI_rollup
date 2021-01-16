import { RoleSetting } from "./RoleSetting";
import { TaskSetting } from "./TaskSetting";

interface TaskGroupInfo {
    [key: string]: { targetRoomList: string[] };
}

export class TaskGroupSetting {
    public roomName: string;
    public room: Room;
    public taskGroupList: string[];
    public constructor(room: Room) {
        this.roomName = room.name;
        this.room = room;
        this.taskGroupList = Memory.rooms[this.roomName].taskGroupList;
    }

    public getTaskGroupInfo(): TaskGroupInfo {
        const info: TaskGroupInfo = {};
        for (const taskGroupName of this.taskGroupList) {
            const taskName = taskGroupName.split("-")[0];
            if (!info[taskName]) info[taskName] = { targetRoomList: [] };
            const targetRoomName = taskGroupName.split("-").length > 1 ? taskGroupName.split("-")[1] : undefined;
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
