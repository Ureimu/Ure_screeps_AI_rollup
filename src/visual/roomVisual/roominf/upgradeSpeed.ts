export function getUpgradeSpeed(roomName: string): string[] {
    const room = Game.rooms[roomName];
    if (room?.controller?.my) {
        if (!global.monitor[roomName] || global.monitor[roomName].level !== room.controller.level) {
            global.monitor[roomName] = {
                level: room.controller.level,
                upgradeSpeed: []
            };
        }
        global.monitor[roomName].upgradeSpeed.push(room.controller?.progress);
    }
    if (global.monitor[roomName].upgradeSpeed.length > 1500) {
        global.monitor[roomName].upgradeSpeed.shift();
    }
    const progressSpeedList: number[] = [];
    global.monitor[roomName].upgradeSpeed.forEach((progress, index, list) => {
        if (index > 0) {
            progressSpeedList.push(progress - list[index - 1]);
        }
    });
    const sum = progressSpeedList.reduce((sumX, progress) => sumX + progress, 0);
    return [
        (sum / progressSpeedList.length).toFixed(4),
        (
            ((room.controller?.progressTotal as number) - (room.controller as StructureController).progress) /
            Number((sum / progressSpeedList.length).toFixed(4))
        ).toFixed(0)
    ];
}
