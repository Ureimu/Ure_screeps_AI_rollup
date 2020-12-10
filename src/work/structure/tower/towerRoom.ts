export function towerR(roomName: string): void {
    defend(roomName);
    repair(roomName, 3300);
}

function defend(roomName: string) {
    const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        const username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        }) as StructureTower[];
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

function repair(roomName: string, hitsMin: number) {
    const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_TOWER
        }
    }) as StructureTower[];
    const targets = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax && object.hits < hitsMin
    });
    targets.sort((a, b) => a.hits - b.hits);
    if (targets.length > 0) {
        towers.forEach(tower => tower.repair(targets[0]));
    }
}
