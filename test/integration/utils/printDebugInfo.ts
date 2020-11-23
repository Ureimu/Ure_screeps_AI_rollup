export function printDebugInfo(memory: Memory, gameTime: number): void {
  let stat = memory.rooms["W0N0"].roomControlStatus;
  console.log("[tick]", gameTime);
  console.log("[memory.errors.errorCount]",JSON.stringify(memory.errors.errorCount));
  console.log("[room.memory.roomControllerStatus]",JSON.stringify(memory.rooms["W0N0"].roomControlStatus));
}
