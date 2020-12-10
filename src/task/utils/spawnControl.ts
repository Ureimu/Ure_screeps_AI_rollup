export function manageSpawn(roleName: string, roomName: string): number {
    const carrier = Game.rooms[roomName].find(FIND_CREEPS, {
        filter: i => {
            return i.memory.task.taskType === "carrySource" && !!i.ticksToLive && i.ticksToLive > 100;
        }
    });
    if (carrier.length > 0) {
        return OK;
    } else {
        if (roleName === "harvestSource" || roleName === "carrySource") {
            return OK;
        } else {
            return ERR_NOT_ENOUGH_ENERGY;
        }
    }
}
