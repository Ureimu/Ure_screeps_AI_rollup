export function printDebugInfo(memory: Memory, gameTime: number): void {
  console.log("[tick]", gameTime);
  console.log("[memory.errors]",JSON.stringify(memory.errors));
}
