interface roleSettingList {
    [taskKindName: string]: {
        [taskName: string]: {
            numberSetting: number;
            priority: number;
            getSpawnTaskInf: (
                room: Room,
                taskName: string,
                taskKindName: string,
                num: number,
                priority: number
            ) => SpawnTaskInf[];
        };
    };
}

interface roleBodySettingList {
    [taskKindName: string]: {
        [taskName: string]: {
            bodysetting: bpgGene[];
            maxBodyParts: number;
        };
    };
}
