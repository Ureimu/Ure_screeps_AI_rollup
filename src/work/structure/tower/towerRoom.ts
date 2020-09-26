export function towerR(roomName:string) {
    defend(roomName);
    repair(roomName,3300);
}

function defend(roomName:string) {
    let hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        let username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        let towers = <StructureTower[]>Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            });
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

function repair(roomName:string, hits_min:number) {
    let towers = <StructureTower[]>Game.rooms[roomName].find(
        FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });
    let targets = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: object => (object.hits < object.hitsMax && object.hits < hits_min)
    });
    targets.sort((a, b) => a.hits - b.hits);
    if (targets.length > 0) {
        towers.forEach(tower => tower.repair(targets[0]));
    }
}
