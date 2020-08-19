//TODO 准备设计。流程：1.用强化物强化 2.拿出storage能量（用terminal购买大量能量） 3.升级controller。
{
    let ckso = require('c_k_screeps_outwards');

    let roleUltraUpgrader_m = {

        /** @param {Creep} creep **/
        run: function (creep) {

            if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.upgrading && creep.store.getFreeCapacity() < 150) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }

            if (!creep.memory.boosted) {
                let targetLabFlag = Game.flags[creep.memory.upgradinginf.targetLabFlag];
                if (ckso.moveToRoom(creep, targetLabFlag.pos.roomName)) {
                    let lab = creep.room.find(FIND_STRUCTURES, { //标明房间内的提供强化资源的Lab
                        filter: (i) => {
                            return (i.pos.x == targetLabFlag.pos.x
                                && i.pos.y == targetLabFlag.pos.y);
                        }
                    });
                    let labReturn = lab[0].boostCreep(creep);
                    if (labReturn == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lab[0], {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                    else if (labReturn == OK) {
                        creep.memory.boosted = true;
                    }
                }
            }
            else if (creep.memory.upgrading) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            } else {
                let targetSourceFlag = Game.flags[creep.memory.upgradinginf.targetSourceFlag];
                if (ckso.moveToRoom(creep, targetSourceFlag.pos.roomName)) {
                    let source = creep.room.find(FIND_MY_STRUCTURES, { //标明房间内的提供资源的建筑
                        filter: (i) => {
                            return (i.pos.x == targetSourceFlag.pos.x
                                && i.pos.y == targetSourceFlag.pos.y);
                        }
                    });
                    if (creep.withdraw(source[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source[0], {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
            }
        },

        keep: function (missionNumber) {
            ckso.trySpawn('ultraUpgrader',
                Memory.creepWorkSetting.ultraUpgrader[missionNumber].bodyparts,
                Memory.creepWorkSetting.ultraUpgrader[missionNumber].spawnName,
                Memory.creepWorkSetting.ultraUpgrader[missionNumber].targetRoom,
                ckso.keepCreepNumber(Memory.creepWorkSetting.ultraUpgrader[missionNumber].spawnNumber,
                    'ultraUpgrader', Memory.creepWorkSetting.ultraUpgrader[missionNumber].spawnName, missionNumber)
                && Memory.creepWorkSetting.ultraUpgrader[missionNumber].ifRun,
                missionNumber
            )
        },

        creepMemory: function (creep, targetSourceFlag, targetLabFlag) {
            if (!creep.memory.upgradinginf) {
                creep.memory.upgradinginf = {};
                creep.memory.upgradinginf.targetSourceFlag = targetSourceFlag;
                creep.memory.upgradinginf.targetLabFlag = targetLabFlag;
            }
        },

        workSetting: function (i, targetSourceFlag, targetLabFlag, spawnName, bodyparts, targetRoom, spawnNumber) {
            Memory.creepWorkSetting.ultraUpgrader[i] = {
                'targetSourceFlag': targetSourceFlag,
                'targetLabFlag': targetLabFlag,
                'spawnName': spawnName,
                'bodyparts': bodyparts,
                'targetRoom': targetRoom,
                'spawnNumber': spawnNumber,
                'ifRun': false
            };
        },

        workSettingLog: function (i, logString) {
            if (!Memory.creepWorkSetting.ultraUpgrader[i].logString) {
                Memory.creepWorkSetting.ultraUpgrader[i].logString = logString;
            }
        }
    };

    module.exports = roleUltraUpgrader_m;
}