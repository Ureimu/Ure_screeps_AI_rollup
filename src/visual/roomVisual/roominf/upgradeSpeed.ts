export function getUpgradeSpeed(roomName: string): string {
    const room = Game.rooms[roomName];
    if (room?.controller?.my) {
        global.monitor.upgradeSpeed.push(room.controller?.progress);
    }
    if (global.monitor.upgradeSpeed.length > 1500) {
        global.monitor.upgradeSpeed.shift();
    }
    const progressSpeedList: number[] = [];
    global.monitor.upgradeSpeed.forEach((progress, index, list) => {
        if (index > 0) {
            progressSpeedList.push(progress - list[index - 1]);
        }
    });
    const sum = progressSpeedList.reduce((sumX, progress) => sumX + progress, 0);
    return (sum / progressSpeedList.length).toFixed(4);
}
