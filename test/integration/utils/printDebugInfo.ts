export function printDebugInfo(memory: Memory, gameTime: number, spawnRoom: string): void {
    console.log("[tick]", gameTime);
    console.log("[memory.errors.errorCount]", JSON.stringify(memory.errors.errorCount));
    console.log("[room.memory.roomControllerStatus]", JSON.stringify(memory.rooms[spawnRoom].roomControlStatus));
    console.log(
        "[spawnMemory]",
        Object.entries(memory.spawns)
            .reduce((str, pair) => {
                return (
                    str +
                    `${pair[0]}:lastFinishSpawnTime:${JSON.stringify(
                        pair[1].lastFinishSpawnTime
                    )},recorder:${JSON.stringify(pair[1].recorder)}\n`
                );
            }, "")
            .trim()
    );
    console.log(
        "[creepMemory]",
        Object.entries(memory.creeps)
            .reduce((str, pair) => {
                return str + `${pair[0]}:bodyparts:${JSON.stringify(pair[1].bodyparts)},\n`;
            }, "")
            .trim()
    );
}
