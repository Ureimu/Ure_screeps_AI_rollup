export function isGoodRoom(room: Room): string {
    const sources = room.find(FIND_SOURCES);
    // if(Game.gcl.level<=Game.rooms)
    const myRoomList = [];
    _.forEach(Game.rooms, anyRoom => {
        if (anyRoom.controller?.my) myRoomList.push(anyRoom.name);
    });
    if (sources.length === 2 && myRoomList.length < Game.gcl.level) return "claim"; // "GoodForHarvest";
    return "NG";
}
// #32
