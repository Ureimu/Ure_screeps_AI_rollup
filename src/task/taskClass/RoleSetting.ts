import { getRoleList } from "task/spawnTask/indexRoleSetting";
import { SpawnTaskInf } from "./extends/SpawnTask";
import { TaskGroupInfo } from "./TaskGroupSetting";

export interface taskKindMemory {
    [taskName: string]: RoomTaskInte;
}

interface RoomTaskInte {
    memory: Partial<Omit<roleSetting, "getSpawnTaskInf">>;
}

export interface roleSettingList {
    [taskGroupName: string]: (
        taskKindMemory: taskKindMemory,
        taskGroupName: string
    ) => {
        [taskName: string]: roleSetting;
    };
}

export type returnedRoleSettingList = {
    [T in keyof roleSettingList]: {
        [P in keyof ReturnType<roleSettingList[T]>]: roleSetting;
    };
};

interface roleSetting {
    numberSetting: number;
    priority: number;
    getSpawnTaskInf: (
        room: Room,
        taskName: string,
        taskGroupName: string,
        num: number,
        priority: number
    ) => SpawnTaskInf[];
}

export class RoleSetting {
    public roomName: string;
    private readonly defaultRoleSettingList: roleSettingList;

    public constructor(room: Room) {
        this.roomName = room.name;
        this.defaultRoleSettingList = getRoleList(room);
    }

    public newOutwardsTask(taskGroupName: string, targetRoomName: string): void {
        this.taskGroup[`${taskGroupName}-${targetRoomName}`] = {
            taskKind: taskGroupName,
            targetRoom: targetRoomName,
            startTime: Game.time
        };
    }

    public deleteOutwardsTask(taskGroupName: string, targetRoomName: string): void {
        delete this.taskGroup[`${taskGroupName}-${targetRoomName}`];
    }

    private get taskGroup(): TaskGroupInfo {
        return Memory.rooms[this.roomName].taskGroup;
    }
    private set taskGroup(taskGroup: TaskGroupInfo) {
        Memory.rooms[this.roomName].taskGroup = taskGroup;
    }

    public get roleSettingList(): returnedRoleSettingList {
        const list: returnedRoleSettingList = {};
        for (const defaultTaskKindName in this.defaultRoleSettingList) {
            if (defaultTaskKindName === "roomMaintenance") {
                Object.defineProperty(list, defaultTaskKindName, {
                    value: this.defaultRoleSettingList[defaultTaskKindName](
                        Memory.rooms[this.roomName].taskSetting[defaultTaskKindName],
                        defaultTaskKindName
                    ),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                for (const taskGroupName in this.taskGroup) {
                    const taskKindName = this.taskGroup[taskGroupName].taskKind;
                    if (taskKindName === defaultTaskKindName) {
                        Object.defineProperty(list, taskGroupName, {
                            value: this.defaultRoleSettingList[defaultTaskKindName](
                                Memory.rooms[this.roomName].taskSetting[taskGroupName],
                                taskGroupName
                            ),
                            writable: true,
                            enumerable: true,
                            configurable: true
                        });
                    }
                }
            }
        }
        return list;
    }
}
