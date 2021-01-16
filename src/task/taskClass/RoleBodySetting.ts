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
    [taskGroupName: string]: (
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
                for (const taskKindNameWithTargetRoomName of this.taskGroupList) {
                    const taskGroupName = taskKindNameWithTargetRoomName.slice(
                        0,
                        taskKindNameWithTargetRoomName.indexOf("-")
                    );
                    if (taskGroupName === defaultTaskKindName) {
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
