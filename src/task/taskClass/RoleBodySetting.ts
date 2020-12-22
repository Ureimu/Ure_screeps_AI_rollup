import { getRoleBodyList } from "task/spawnTask/bodypartsSetting";

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
