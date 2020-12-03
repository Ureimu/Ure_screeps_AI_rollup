export function printDebugInfo(memory: Memory, gameTime: number, spawnRoom: string): void {
    let stat = memory.rooms[spawnRoom].roomControlStatus;
    console.log("[tick]", gameTime);
    console.log("[memory.errors.errorCount]", JSON.stringify(memory.errors.errorCount));
    console.log("[room.memory.roomControllerStatus]", JSON.stringify(memory.rooms[spawnRoom].roomControlStatus));
}
