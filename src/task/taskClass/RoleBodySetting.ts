import { getRoleBodyList } from "task/spawnTask/bodypartsSetting";
import { bpgGene } from "utils/bodypartsGenerator";
import { TaskGroupInfo } from "./TaskGroupSetting";

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
                for (const taskGroupName in this.taskGroup) {
                    const taskKindName = this.taskGroup[taskGroupName].taskKind;
                    if (taskKindName === defaultTaskKindName) {
                        Object.defineProperty(list, taskGroupName, {
                            value: this.defaultRoleBodySettingList[defaultTaskKindName](
                                Memory.rooms[this.roomName].taskSetting[taskGroupName]
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
