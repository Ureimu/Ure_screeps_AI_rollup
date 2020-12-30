import { getRoleList } from "task/spawnTask/indexRoleSetting";
import { SpawnTaskInf } from "./extends/SpawnTask";

interface taskKindMemory {
    [taskName: string]: RoomTaskInte;
}

interface RoomTaskInte {
    memory: Partial<Omit<roleSetting, "getSpawnTaskInf">>;
}

export interface roleSettingList {
    [taskKindName: string]: (
        taskKindMemory: taskKindMemory
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
        taskKindName: string,
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
        if (!this.taskKindList) {
            this.taskKindList = ["roomMaintenance"];
        }
    }

    public newOutwardsTask(taskKindName: string, targetRoomName: string): void {
        this.taskKindList.push(`${taskKindName}-${targetRoomName}`);
    }

    public deleteOutwardsTask(taskKindName: string, targetRoomName: string): void {
        this.taskKindList.forEach((value, index) => {
            if (value === `${taskKindName}-${targetRoomName}`) this.taskKindList.splice(index, 1);
        });
    }

    private get taskKindList(): string[] {
        return Memory.rooms[this.roomName].taskKindList;
    }
    private set taskKindList(taskKindList: string[]) {
        Memory.rooms[this.roomName].taskKindList = taskKindList;
    }

    public get roleSettingList(): returnedRoleSettingList {
        const list: returnedRoleSettingList = {};
        for (const defaultTaskKindName in this.defaultRoleSettingList) {
            if (defaultTaskKindName === "roomMaintenance") {
                Object.defineProperty(list, defaultTaskKindName, {
                    value: this.defaultRoleSettingList[defaultTaskKindName](
                        Memory.rooms[this.roomName].taskSetting[defaultTaskKindName]
                    ),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                for (const taskKindNameWithTargetRoomName of this.taskKindList) {
                    const taskKindName = taskKindNameWithTargetRoomName.slice(
                        0,
                        taskKindNameWithTargetRoomName.indexOf("-")
                    );
                    if (taskKindName === defaultTaskKindName) {
                        Object.defineProperty(list, taskKindNameWithTargetRoomName, {
                            value: this.defaultRoleSettingList[defaultTaskKindName](
                                Memory.rooms[this.roomName].taskSetting[taskKindNameWithTargetRoomName]
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
