//在某些时候，可能需要额外的人手帮忙运输，比如在进行terminal相关操作时。这个时候就可以使用这个角色。
//代码作用是 从origin取出能量，放入destination。
//Game.spawns['Spawn1'].spawnCreep(Memory.c_k_info.bodypartSetting[0], 'extraCarrier'+Game.time, {memory: {role: 'extraCarrier', carryTo: '5f0cd6ac716e443522c6d8af', carryFrom: '5eff14ec7109c31f7bef9000'}}); 
{
    let ckso = require('c_k_screeps_outwards');

    let roleExtraCarrier = {
        run: function (creep) {
            /*
             *carryFrom和carryTo存的是物品对应的id。
             */
            if (!creep.memory.carrying.carryFrom || !creep.memory.carrying.carryTo || !creep.memory.carrying.carryThings) {
                console.log('bug Here In Extra Carrier');
            } else {
                const origin = Game.getObjectById(creep.memory.carrying.carryFrom);
                const destination = Game.getObjectById(creep.memory.carrying.carryTo);
                const things = creep.memory.carrying.carryThings;

                if (!creep.memory.harvesting && creep.store[things] == 0) {
                    creep.memory.harvesting = true;
                    creep.say('🔄 harvest');
                }
                if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                    creep.memory.harvesting = false;
                    creep.say('🚧 transfer');
                }

                if (creep.memory.harvesting) {
                    if (creep.withdraw(origin, things) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(origin, {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                } else {
                    if (creep.transfer(destination, things) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(destination, {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                }
            }
        },

        keep: function (missionNumber) {
            ckso.trySpawn('extraCarrier',
                Memory.creepWorkSetting.extraCarrier[missionNumber].bodyparts,
                Memory.creepWorkSetting.extraCarrier[missionNumber].spawnName,
                Memory.creepWorkSetting.extraCarrier[missionNumber].targetRoom,
                ckso.keepCreepNumber(1, 'extraCarrier', Memory.creepWorkSetting.extraCarrier[missionNumber].spawnName, missionNumber)
                && Memory.creepWorkSetting.extraCarrier[missionNumber].ifRun,
                missionNumber
            )
        },

        creepMemory: function (creep: Creep, carryFrom, carryTo, carryThings) {
            if (!creep.memory.carrying) {
                creep.memory.carrying = {
                    carryFrom: carryFrom,
                    carryTo: carryTo,
                    carryThings: carryThings
                };
            }
        },

        workSetting: function (i, carryFrom, carryTo, carryThings, spawnName, bodyparts, targetRoom) {
            Memory.creepWorkSetting.extraCarrier[i] = {
                'carryFrom': carryFrom,
                'carryTo': carryTo,
                'carryThings': carryThings,
                'spawnName': spawnName,
                'bodyparts': bodyparts,
                'targetRoom': targetRoom,
                'ifRun': false
            };
        },

        workSettingLog: function (i, logString) {
            if (!Memory.creepWorkSetting.extraCarrier[i].logString) {
                Memory.creepWorkSetting.extraCarrier[i].logString = logString;
            }
        }
    };
    module.exports = roleExtraCarrier;
}