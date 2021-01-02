export function printDebugInfo(memory: Memory, gameTime: number, spawnRoom: string): void {
    console.log("[tick]", gameTime);
    console.log("[memory.errors.errorCount]", JSON.stringify(memory.errors.errorCount));
    console.log("[memory.errors]", memory.errors.errorList.toString());
    console.log("[room.memory.roomControllerStatus]", JSON.stringify(memory.rooms[spawnRoom].roomControlStatus));
    console.log("[room.memory.stats]", JSON.stringify(memory.rooms[spawnRoom].stats));
    console.log(
        "[spawnMemory]",
        Object.entries(memory.spawns)
            .reduce((str, pair) => {
                return (
                    str +
                    `${pair[0]}:lastFinishSpawnTime:${JSON.stringify(
                        pair[1].lastFinishSpawnTime
                    )},recorder:${JSON.stringify(pair[1].recorder)},spawnQueueLength:${
                        pair[1].taskPool.spawnQueue.length
                    }\n`
                );
            }, "")
            .trim()
    );
    console.log("[creepMemory]", memory.creeps ? Object.entries(memory.creeps).length : 0);
}

export function printOutputDebugInfo(memory: Memory): string {
    let text = "";
    text += `${Object.entries(memory.creeps)
        .reduce((str, pair) => {
            return str + `${pair[0]}:bodyparts:${JSON.stringify(pair[1].task.spawnInf.bodyparts)},\n`;
        }, "")
        .trim()}\n`;
    return text;
}
