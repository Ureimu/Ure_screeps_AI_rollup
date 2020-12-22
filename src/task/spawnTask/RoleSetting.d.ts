interface roleSettingList {
    [taskKindName: string]: (
        taskKindMemory: taskKindMemory
    ) => {
        [taskName: string]: roleSetting;
    };
}

type returnedRoleSettingList = {
    [T in keyof roleSettingList]: {
        [P in keyof ReturnType<roleSettingList[T]>]: roleSetting;
    };
};

interface roleBodySettingList {
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

interface roleBodySetting {
    bodysetting: bpgGene[];
    maxBodyParts: number;
}

interface RoomTaskInte {
    memory: Partial<Omit<roleSetting, "getSpawnTaskInf"> & roleBodySetting>;
}
