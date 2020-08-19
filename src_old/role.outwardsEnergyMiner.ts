{
let ckso = require('c_k_screeps_outwards');

let roleOutwardsEnergyMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] < 50) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('🚧 transfer');
        }

        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (target) {
            creep.pickup(target);
        }

        if(!creep.memory.lasthits){//伤害部分,用来呼救
            creep.memory.lasthits = creep.hits;
            creep.memory.beingAttacked = false;
        }
        if (creep.hits < creep.memory.lasthits){
            creep.say('attacked');
            creep.memory.beingAttacked = true;
        }
        if (creep.memory.beingAttacked == true && creep.hits == creep.hitsMax){
            creep.say('healed');
            creep.memory.beingAttacked = false;
        }
        creep.memory.lasthits =creep.hits;

        if (creep.memory.harvesting) { //采集能量资源
            let targetSourceFlag = Game.flags[creep.memory.harvestinginf.targetSourceFlag];
            if(ckso.moveToRoom(creep, targetSourceFlag.pos.roomName)){
                let source = creep.room.find(FIND_SOURCES, { //标明房间内的资源
                    filter: (Source) => {
                        return (Source.pos.x == targetSourceFlag.pos.x 
                            && Source.pos.y == targetSourceFlag.pos.y);
                    }
                });
                if (creep.harvest(source[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        } else {
            let targetContainerFlag = Game.flags[creep.memory.harvestinginf.targetContainerFlag];
            if(ckso.moveToRoom(creep, targetContainerFlag.pos.roomName)){
                let container = creep.room.find(FIND_STRUCTURES, { 
                    filter: (i) => {
                        return (i.pos.x == targetContainerFlag.pos.x 
                            && i.pos.y == targetContainerFlag.pos.y);
                    }
                });
                if (creep.transfer(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        }
    },

    keep: function (missionNumber) {
        ckso.trySpawn('outwardsEnergyMiner',
            Memory.creepWorkSetting.outwardsEnergyMiner[missionNumber].bodyparts,
            Memory.creepWorkSetting.outwardsEnergyMiner[missionNumber].spawnName,
            Memory.creepWorkSetting.outwardsEnergyMiner[missionNumber].targetRoom, 
            ckso.keepCreepNumber(Memory.creepWorkSetting.outwardsEnergyMiner[missionNumber].spawnNumber,
                 'outwardsEnergyMiner', Memory.creepWorkSetting.outwardsEnergyMiner[missionNumber].spawnName, missionNumber)
             && Memory.creepWorkSetting.outwardsEnergyMiner[missionNumber].ifRun,
            missionNumber
        )
    },

    creepMemory:function (creep, targetSourceFlag, targetContainerFlag) {
        if (!creep.memory.harvestinginf) {
            creep.memory.harvestinginf = {};
            creep.memory.harvestinginf.targetSourceFlag = targetSourceFlag;
            creep.memory.harvestinginf.targetContainerFlag = targetContainerFlag;
        }
    },

    /**
     *任务函数
     *
     * @param {Number} i 任务编号
     * @param {*} spawnName 出生点名称
     * @param {*} bodyparts 身体部件
     * @param {*} targetRoom 目标房间，这里没用到
     * @param {string} targetSourceFlag 资源旗帜名称
     * @param {string} targetContainerFlag 存放容器旗帜名称，可以是任意能够存放资源的建筑
     */
    workSetting:function (i,targetSourceFlag, targetContainerFlag, spawnName, bodyparts, targetRoom, spawnNumber) {
        Memory.creepWorkSetting.outwardsEnergyMiner[i]={
            'targetSourceFlag': targetSourceFlag,
            'targetContainerFlag': targetContainerFlag,
            'spawnName': spawnName,
            'bodyparts': bodyparts,
            'targetRoom': targetRoom,
            'spawnNumber': spawnNumber,
            'ifRun': false
        };
    },

    workSettingLog: function (i, logString) {
        if (!Memory.creepWorkSetting.outwardsEnergyMiner[i].logString){
            Memory.creepWorkSetting.outwardsEnergyMiner[i].logString =logString;
        }
    }
};

module.exports = roleOutwardsEnergyMiner;
}