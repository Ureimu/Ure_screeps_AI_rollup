interface RoomMemory {
    stats: {
        upgradeSpeed: string;
        creepNum: number;
        creepBodySize: number;
        creepBodySizeInSpawnQueue: {
            [key: string]: number;
        };
        ticksToUpgrade: string;
    };
}
