/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

let tower_sp_m = {
    defend: function (roomName) {
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
    },

    getEnergy: function (creep) {
        let targets = creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的塔
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > creep.room.controller.level * 70);
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        }
    },

    repair: function (roomName, hits_min) {
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
};

module.exports = tower_sp_m;