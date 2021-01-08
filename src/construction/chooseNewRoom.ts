export function isGoodRoom(room: Room): string {
    if (room.find(FIND_SOURCES).length === 2) return "GoodForHarvest";
    return "NG";
}
// #32
