{
    let ckso = require('c_k_screeps_outwards');

    let roleClaimer_m = {
        /*
        该角色不仅承担了claim，还承担了进行援建的事项。
        /** @param {Creep} creep **/
        /**
         *角色：claimer
         *
         * @param {Creep} creep claimer
         */
        run: function (creep: Creep) {
            //Game.spawns['Spawn1'].spawnCreep(Memory.c_k_info.bodypartSetting[0], 'Claimer'+Game.time, {memory: {role: 'claimer', roomClaim: 'E35S21', doReserve: true}}); 
            //请手动输入代码到console,自己修改需要claim的room,出生点,注意检查是不是忘了加CLAIM部件。
            let roomToClaim = Game.rooms[creep.memory.targetRoom];
            if (creep.memory.claiming.doReserve) {
                if (creep.room.name != creep.memory.targetRoom) {
                    creep.moveTo(new RoomPosition(25, 20, creep.memory.targetRoom));
                } else if (roomToClaim.controller) {
                    if (creep.reserveController(roomToClaim.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roomToClaim.controller);
                    }
                }
            } else if (creep.room.name != creep.memory.targetRoom) {
                creep.moveTo(new RoomPosition(25, 20, creep.memory.targetRoom));
            } else if (roomToClaim.controller && !roomToClaim.controller.my) {
                if (creep.claimController(roomToClaim.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roomToClaim.controller);
                }
            } else if (roomToClaim.controller.my) {
                if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.building = false;
                    creep.say('🔄 harvest');
                }
                if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                    creep.memory.building = true;
                    creep.say('🚧 build');
                }

                let targetsSpawn_x = <(StructureSpawn|StructureExtension)[]>creep.room.find(FIND_STRUCTURES, { //标明房间内未装满的扩展和出生点
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                let targetsSpawn = <StructureSpawn|StructureExtension>creep.pos.findClosestByRange(targetsSpawn_x);

                if (creep.memory.building) {
                    let targets = <ConstructionSite[]>creep.room.find(FIND_CONSTRUCTION_SITES);
                    if (targetsSpawn_x.length) {
                        if (creep.transfer(targetsSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targetsSpawn, {
                                visualizePathStyle: {
                                    stroke: '#ffffff'
                                }
                            });
                        }
                    }
                    else if (targets.length) {
                        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {
                                visualizePathStyle: {
                                    stroke: '#ffffff'
                                }
                            });
                        }
                    } else { //让闲置的建造者去升级。
                        let roleUpgrader = require('role.upgrader');
                        roleUpgrader.run(creep);
                    }
                } else {
                    let sources: Source[] = creep.room.find(FIND_SOURCES);

                    if (sources[1].energy > 0) {
                        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[1], {
                                visualizePathStyle: {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                }
            }
        },

        keep: function (missionNumber: number) {
            ckso.trySpawn('claimer',
                Memory.creepWorkSetting.claimer[missionNumber].bodyparts,
                Memory.creepWorkSetting.claimer[missionNumber].spawnName,
                Memory.creepWorkSetting.claimer[missionNumber].targetRoom,
                ckso.keepCreepNumber(Memory.creepWorkSetting.claimer[missionNumber].spawnNumber,
                    'claimer', Memory.creepWorkSetting.claimer[missionNumber].spawnName, missionNumber)
                && Memory.creepWorkSetting.claimer[missionNumber].ifRun,
                missionNumber
            )
        },

        creepMemory: function (creep: Creep, doReserve: boolean) {
            if (!creep.memory.claiming) {
                creep.memory.claiming = {
                    doReserve: doReserve
                };
            }
        },

        workSetting: function (i: string | number, doReserve: boolean, spawnName: string, bodyparts: any, targetRoom: any, spawnNumber: any) {
            Memory.creepWorkSetting.claimer[i] = {
                'doReserve': doReserve,
                'spawnName': spawnName,
                'bodyparts': bodyparts,
                'targetRoom': targetRoom,
                'spawnNumber': spawnNumber,
                'ifRun': false
            };
        },

        workSettingLog: function (i: number, logString: string) {
            if (!Memory.creepWorkSetting.claimer[i].logString) {
                Memory.creepWorkSetting.claimer[i].logString = logString;
            }
        }
    };

    module.exports = roleClaimer_m;
}