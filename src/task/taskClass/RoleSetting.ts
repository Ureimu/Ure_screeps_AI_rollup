import { getRoleList } from "task/spawnTask/indexRoleSetting";
import { SpawnTaskInf } from "./extends/SpawnTask";

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
        if (!this.taskGroupList) {
            this.taskGroupList = ["roomMaintenance"];
        }
    }

    public newOutwardsTask(taskGroupName: string, targetRoomName: string): void {
        this.taskGroupList.push(`${taskGroupName}-${targetRoomName}`);
    }

    public deleteOutwardsTask(taskGroupName: string, targetRoomName: string): void {
        this.taskGroupList.forEach((value, index) => {
            if (value === `${taskGroupName}-${targetRoomName}`) this.taskGroupList.splice(index, 1);
        });
    }

    private get taskGroupList(): string[] {
        return Memory.rooms[this.roomName].taskGroupList;
    }
    private set taskGroupList(taskGroupList: string[]) {
        Memory.rooms[this.roomName].taskGroupList = taskGroupList;
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
                for (const taskKindNameWithTargetRoomName of this.taskGroupList) {
                    const taskGroupName = taskKindNameWithTargetRoomName.split("-")[0];
                    if (taskGroupName === defaultTaskKindName) {
                        Object.defineProperty(list, taskKindNameWithTargetRoomName, {
                            value: this.defaultRoleSettingList[defaultTaskKindName](
                                Memory.rooms[this.roomName].taskSetting[taskKindNameWithTargetRoomName],
                                taskKindNameWithTargetRoomName
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
