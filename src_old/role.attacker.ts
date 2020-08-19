//TODO 基本功能设计完成。
{
    let ckso = require('c_k_screeps_outwards');

    let roleAttacker_m = {
        /**
         *角色：attacker ,该角色为主动进攻的creep。
         *
         * @param {Creep} creep attacker
         */
        run: function (creep: Creep) {
            if (!creep.memory.attacking.targets) {
                console.log('bug Here In Attacker');
            }
            if (ckso.goToRoom(creep)) {
                let targets: Creep[] = eval(creep.memory.attacking.targets);//用给定的目标代码来寻找敌人
                const target: Creep = creep.pos.findClosestByRange(targets);
                if (target) {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {//进攻敌人
                        creep.moveTo(target);
                    }
                } else {
                    let flagToStay = Game.flags[creep.memory.attacking.flagToStay];//没有敌人则呆在给定的旗帜下
                    if (creep.pos != flagToStay.pos) {
                        creep.moveTo(flagToStay);
                    }
                }
            }
        },

        keep: function (missionNumber) {
            ckso.trySpawn('attacker',
                Memory.creepWorkSetting.attacker[missionNumber].bodyparts,
                Memory.creepWorkSetting.attacker[missionNumber].spawnName,
                Memory.creepWorkSetting.attacker[missionNumber].targetRoom,
                ckso.keepCreepNumber(1, 'attacker', Memory.creepWorkSetting.attacker[missionNumber].spawnName, missionNumber)
                && Memory.creepWorkSetting.attacker[missionNumber].ifRun,
                missionNumber
            )
        },

        creepMemory: function (creep, targets, flagToStay) {
            if (!creep.memory.attacking) {
                creep.memory.attacking = {};
                creep.memory.attacking.targets = targets;
                creep.memory.attacking.flagToStay = flagToStay;
            }
        },

        workSetting: function (i, targets, flagToStay, spawnName, bodyparts, targetRoom) {
            Memory.creepWorkSetting.attacker[i] = {
                'targets': targets,
                'flagToStay': flagToStay,
                'spawnName': spawnName,
                'bodyparts': bodyparts,
                'targetRoom': targetRoom,
                'ifRun': false
            };
        },

        workSettingLog: function (i, logString) {
            if (!Memory.creepWorkSetting.attacker[i].logString) {
                Memory.creepWorkSetting.attacker[i].logString = logString;
            }
        }
    };

    module.exports = roleAttacker_m;
}