interface roleSettingList {
    [name: string]: {
        [name: string]: {
            numberSetting: number;
            priority: number;
            getSpawnTaskInf: (room: Room, taskName: string, num: number, priority: number) => SpawnTaskInf[];
        };
    };
}

interface roleBodySettingList {
    [name: string]: {
        [name: string]: {
            bodysetting: bpgGene[];
            maxBodyParts: number;
        };
    };
}
