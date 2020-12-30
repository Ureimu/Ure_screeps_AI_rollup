declare namespace NodeJS {
    interface Global {
        creepMemory: {
            [name: string]: {
                bundledPos?: RoomPosition;
                bundledUpgradePos?: RoomPosition;
                bundledStoragePos?: RoomPosition;
                bundledLinkPos?: RoomPosition;
            };
        };
    }
}
