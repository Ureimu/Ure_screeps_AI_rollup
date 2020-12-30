import { getRoleBodyList } from "task/spawnTask/bodypartsSetting";
import { bpgGene } from "utils/bodypartsGenerator";

interface roleBodySetting {
    bodysetting: bpgGene[];
    maxBodyParts: number;
}

interface taskKindMemory {
    [taskName: string]: RoomTaskInte;
}

interface RoomTaskInte {
    memory: Partial<roleBodySetting>;
}

export interface roleBodySettingList {
    [taskKindName: string]: (
        taskKindMemory: taskKindMemory
    ) => {
        [taskName: string]: roleBodySetting;
    };
}

type returnedRoleBodySettingList = {
    [T in keyof roleBodySettingList]: {
        [P in keyof ReturnType<roleBodySettingList[T]>]: roleBodySetting;
    };
};

export class RoleBodySetting {
    public roomName: string;
    private readonly defaultRoleBodySettingList: roleBodySettingList;

    public constructor(room: Room) {
        this.roomName = room.name;
        this.defaultRoleBodySettingList = getRoleBodyList(room);
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

    public get roleBodySettingList(): returnedRoleBodySettingList {
        const list: returnedRoleBodySettingList = {};
        for (const defaultTaskKindName in this.defaultRoleBodySettingList) {
            if (defaultTaskKindName === "roomMaintenance") {
                Object.defineProperty(list, defaultTaskKindName, {
                    value: this.defaultRoleBodySettingList[defaultTaskKindName](
                        Memory.rooms[this.roomName].taskSetting[defaultTaskKindName] as taskKindMemory
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
                            value: this.defaultRoleBodySettingList[defaultTaskKindName](
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
