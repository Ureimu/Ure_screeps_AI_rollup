//TODO 这里是对creep进行非常态设定的地方。仅针对非常态的creep有效。
//这里会对新出生的creep进行记忆设定。

//添加一个新角色的步骤：1.写好运行逻辑 2.在temporary添加基本设置(要分别在run和workSetting里分别改) 3.在main中导入相关模块 4.清除一次c_k_info 5.使用一次Memory.creepWorkSetting.refresh=true .
//添加一个新任务的步骤：1.在下面添加任务 2.使用一次Memory.creepWorkSetting.refresh=true 3.执行ifRun=true
//如果要为一个已经产生的creep应用新的任务代码，这需要手动删除对应creep的memory中的相关任务信息，然后使用一次Memory.creepWorkSetting.refresh=true。
//注意：如果执行了Memory.creepWorkSetting.refresh=true会导致当前的所有任务状态重置，包括ifRun的值，所以在刷新后需要重新手动启动相关任务。
//注意：如果控制台已经开始报错，请在main里面使用（delete 路径名）来删除对应的memory.
{
    let roleExtraCarrier = require('role.extraCarrier');
    let roleAttacker = require('role.attacker');
    let roleOutwardsEnengyMiner = require('role.outwardsEnergyMiner');
    let roleClaimer = require('role.claimer');
    let roleUltraUpgrader = require('role.ultraUpgrader');

    let temporary = {

        /**
         *该函数是用来给creep写入记忆的，在新增角色任务时需要在该函数增加对应任务的memory写入代码。
         *
         * @param {Creep} creep
         */
        run: function (creep: Creep):void {

            /**
             *一个检测creep角色名是否和参数相同的函数。
             *
             * @param {*} name
             * @returns
             */
            function ifName(name: any) {
                if (creep.memory.role == name) {
                    return true;
                } else {
                    return false;
                }
            }
            let roleToRunListOutwards = [roleExtraCarrier, roleAttacker, roleOutwardsEnengyMiner, roleClaimer, roleUltraUpgrader];
            let roleList = Memory.c_k_info.creepRoleListGivenOutOutwards;

            //下方是为新产生的creep写入memory的列表
            //extraCarrier
            for (let i = 0, j = Memory.creepWorkSetting[roleList[0]].length; i < j; i++) {
                if (ifName(roleList[0]) && creep.memory.missionNumber == i) {
                    roleToRunListOutwards[0].creepMemory(
                        creep,
                        Memory.creepWorkSetting[roleList[0]][i].carryFrom,
                        Memory.creepWorkSetting[roleList[0]][i].carryTo,
                        Memory.creepWorkSetting[roleList[0]][i].carryThings
                    );
                    if (i == 5 && Memory.creepWorkSetting[roleList[0]][i].ifRun == false) {
                        creep.suicide();
                    }
                }
            }

            //attacker
            for (let i = 0, j = Memory.creepWorkSetting[roleList[1]].length; i < j; i++) {
                if (ifName(roleList[1]) && creep.memory.missionNumber == i) {
                    roleToRunListOutwards[1].creepMemory(
                        creep,
                        Memory.creepWorkSetting[roleList[1]][i].targets,
                        Memory.creepWorkSetting[roleList[1]][i].flagToStay
                    );
                }
            }

            //outwardsEnergyMiner
            for (let i = 0, j = Memory.creepWorkSetting[roleList[2]].length; i < j; i++) {
                if (ifName(roleList[2]) && creep.memory.missionNumber == i) {
                    roleToRunListOutwards[2].creepMemory(
                        creep,
                        Memory.creepWorkSetting[roleList[2]][i].targetSourceFlag,
                        Memory.creepWorkSetting[roleList[2]][i].targetContainerFlag
                    );
                }
            }

            //claimer
            for (let i = 0, j = Memory.creepWorkSetting[roleList[3]].length; i < j; i++) {
                if (ifName([roleList[3]]) && creep.memory.missionNumber == i) {
                    roleToRunListOutwards[3].creepMemory(
                        creep,
                        Memory.creepWorkSetting[roleList[3]][i].doReserve
                    );
                }
            }

            //ultraUpgrader
            for (let i = 0, j = Memory.creepWorkSetting[roleList[4]].length; i < j; i++) {
                if (ifName([roleList[4]]) && creep.memory.missionNumber == i) {
                    roleToRunListOutwards[4].creepMemory(
                        creep,
                        Memory.creepWorkSetting[roleList[4]][i].targetSourceFlag,
                        Memory.creepWorkSetting[roleList[4]][i].targetLabFlag
                    );
                }
            }
        },

        workSetting: function () {
            //基础设置,不用更改

            if (!Memory.creepWorkSetting) {
                //@ts-ignore
                Memory.creepWorkSetting = {
                };
            }

            for (let i = 0, j = Memory.c_k_info.creepRoleListGivenOutOutwards.length; i < j; i++) {
                if (!Memory.creepWorkSetting[Memory.c_k_info.creepRoleListGivenOutOutwards[i]]) {
                    Memory.creepWorkSetting[Memory.c_k_info.creepRoleListGivenOutOutwards[i]] = [];
                }
            }

            //下面是任务列表
            if (Memory.creepWorkSetting.refresh) {
                //extraCarrier 0
                roleExtraCarrier.workSetting(
                    0,
                    '5f08f47f8630484e3f42ca44',
                    '5eff14ec7109c31f7bef9000',
                    'energy',
                    'Spawn2',
                    (global.bpg([{ 'carry': 8, 'move': 8 }])),
                    'E34S21'
                );
                roleExtraCarrier.workSettingLog(
                    0,
                    '第一次创建的任务，可以先看看。\n该任务是将E35S21的storage能量搬运到E34S21的storage。'
                );

                //extraCarrier 1
                roleExtraCarrier.workSetting(
                    1,
                    '5f09c71ff1837985d4e0693f',
                    '5eff14ec7109c31f7bef9000',
                    'energy',
                    'Spawn1',
                    (global.bpg([{ 'carry': 8, 'move': 1 }])),
                    'E34S21'
                );
                roleExtraCarrier.workSettingLog(
                    1,
                    '将link的能量输送到容器'
                );

                //extraCarrier 2
                roleExtraCarrier.workSetting(
                    2,
                    '5f0cd6ac716e443522c6d8af',
                    '5f0d6c22dbdda427e473bbf9',
                    'XGH2O',
                    'Spawn1',
                    (global.bpg([{ 'carry': 4, 'move': 4 }])),
                    'E34S21'
                );
                roleExtraCarrier.workSettingLog(
                    2,
                    '将XGH2O从终端输送到LAB'
                );

                //extraCarrier 3
                roleExtraCarrier.workSetting(
                    3,
                    '5eff14ec7109c31f7bef9000',
                    '5f09c71ff1837985d4e0693f',
                    'energy',
                    'Spawn1',
                    (global.bpg([{ 'carry': 16, 'move': 1 }])),
                    'E34S21'
                );
                roleExtraCarrier.workSettingLog(
                    3,
                    '将能量从大容器输送到Link'
                );

                //extraCarrier 4
                roleExtraCarrier.workSetting(
                    4,
                    '5eff14ec7109c31f7bef9000',
                    '5f0d6c22dbdda427e473bbf9',
                    'energy',
                    'Spawn1',
                    (global.bpg([{ 'carry': 16, 'move': 1 }])),
                    'E34S21'
                );
                roleExtraCarrier.workSettingLog(
                    4,
                    '将能量从大容器输送到Lab'
                );

                //extraCarrier 5
                roleExtraCarrier.workSetting(
                    5,
                    '5f0cd6ac716e443522c6d8af',
                    '5eff14ec7109c31f7bef9000',
                    'energy',
                    'Spawn1',
                    (global.bpg([{ 'carry': 16, 'move': 16 }])),
                    'E34S21'
                );
                roleExtraCarrier.workSettingLog(
                    5,
                    '将能量从终端输送到大容器'
                );

                //extraCarrier 6
                roleExtraCarrier.workSetting(
                    6,
                    '5f08f47f8630484e3f42ca44',
                    '5f1beed97f30cdfc7919dcd2',
                    'energy',
                    'Spawn2',
                    (global.bpg([{ 'carry': 9, 'move': 1 }])),
                    'E35S21'
                );
                roleExtraCarrier.workSettingLog(
                    6,
                    'E35S21升级任务\n将能量从大容器输送到终端'
                );

                //attacker 0
                roleAttacker.workSetting(
                    0,
                    '(creep.room.find(FIND_STRUCTURES,\
                {filter: (i) => {\
                return i.structureType == STRUCTURE_WALL }}))',
                    'E33S21Defender',
                    'Spawn1',
                    [MOVE, ATTACK],
                    'E33S21'
                );
                roleAttacker.workSettingLog(
                    0,
                    '这个任务是用来清除其他图的城墙的,rcl>0'
                );

                //attacker 1
                roleAttacker.workSetting(
                    1,
                    '(creep.room.find(FIND_HOSTILE_CREEPS))',
                    'E34S21Defender',
                    'Spawn1',
                    global.bpg([{ 'tough': 25 }, { 'move': 15, 'attack': 5 }]),
                    'E34S21'
                );
                roleAttacker.workSettingLog(
                    1,
                    '这个任务是用来进行防御的,rcl>=4'
                );

                //attacker 2
                roleAttacker.workSetting(
                    2,
                    '(creep.room.find(FIND_HOSTILE_CREEPS))',
                    'E33S21Defender',
                    'Spawn1',
                    global.bpg([{ 'tough': 25 }, { 'move': 15, 'attack': 5 }]),
                    'E33S21'
                );
                roleAttacker.workSettingLog(
                    2,
                    '这个任务是用来进行防御的,rcl>=4'
                );

                //attacker 3
                roleAttacker.workSetting(
                    3,
                    '(creep.room.find(FIND_HOSTILE_CREEPS))',
                    'E31S18Defender',
                    'Spawn3',
                    global.bpg([{ 'tough': 6 }, { 'move': 9, 'attack': 3 }]),
                    'E31S18'
                );
                roleAttacker.workSettingLog(
                    3,
                    'E31S18,这个任务是用来进行防御的,rcl>=4'
                );

                //outwardsEnergyMiner 0
                roleOutwardsEnengyMiner.workSetting(
                    0,
                    'E33S21Source0',
                    'E34S21Link0',
                    'Spawn4',
                    (global.bpg([{ 'work': 15, 'move': 15, 'carry': 15 }])),
                    'E33S21',
                    1
                );
                roleOutwardsEnengyMiner.workSettingLog(
                    0,
                    '采集外矿运输到指定建筑的任务'
                );

                //claimer 0
                roleClaimer.workSetting(
                    0,
                    true,
                    'Spawn4',
                    (global.bpg([{ 'claim': 2, 'move': 4 }])),
                    'E33S21',
                    1
                );
                roleClaimer.workSettingLog(
                    0,
                    '做预定任务'
                );

                //claimer 1
                roleClaimer.workSetting(
                    1,
                    false,
                    'Spawn1',
                    (global.bpg([{ 'move': 5, 'claim': 1 }])),
                    'E31S18',
                    1
                );
                roleClaimer.workSettingLog(
                    1,
                    '占领E31S18'
                );

                //claimer 2
                roleClaimer.workSetting(
                    2,
                    false,
                    'Spawn4',
                    (global.bpg([{ 'move': 20, 'work': 10, 'carry': 20 }])),
                    'E31S18',
                    2
                );
                roleClaimer.workSettingLog(
                    2,
                    '援建E31S18'
                );

                //ultraUpgrader 0
                roleUltraUpgrader.workSetting(
                    0,
                    'E34S21Link1',
                    'E34S21Lab0',
                    'Spawn1',
                    (global.bpg([{ 'work': 15, 'move': 8, 'carry': 8 }])),
                    'E34S21',
                    1
                );
                roleUltraUpgrader.workSettingLog(
                    0,
                    '做快速升级任务'
                );


                //这里是末尾了.
                Memory.creepWorkSetting.refresh = false;
            }
        },

        runMission: function () {
            let mis = Memory.creepWorkSetting;
            //defending
            let hostiles = {//这里一般只添加有稳定视野的需要防御的房间。
                'E34S21': Game.rooms['E34S21'].find(FIND_HOSTILE_CREEPS),
                'E31S18': Game.rooms['E31S18'].find(FIND_HOSTILE_CREEPS)
            }
            for (const roomName in hostiles) {
                for (let i = 0, j = mis.attacker.length; i < j; i++) {
                    if (hostiles[roomName].length > 0 && mis.attacker[i].targetRoom == roomName && mis.attacker[1].ifRun == false) {
                        mis.attacker[1].ifRun = true;
                    }
                    else if (hostiles[roomName].length == 0 && mis.attacker[i].targetRoom == roomName && mis.attacker[1].ifRun == true) {
                        mis.attacker[1].ifRun = false;
                    }
                }
            }

            //carrying energy and XGH2O to lab when not enough
            if (mis.ultraUpgrader[0].ifRun == true) {
                let usingLab = <StructureLab>Game.getObjectById('5f0d6c22dbdda427e473bbf9');
                let terminal = <StructureTerminal>Game.getObjectById('5f0cd6ac716e443522c6d8af');
                if (usingLab.store[RESOURCE_ENERGY] < 300 && mis.extraCarrier[4].ifRun == false) {
                    mis.extraCarrier[4].ifRun = true;
                }
                else if (usingLab.store[RESOURCE_ENERGY] == 2000 && mis.extraCarrier[4].ifRun == true) {
                    mis.extraCarrier[4].ifRun = false;
                }

                if (usingLab.store['XGH2O'] < 450 && mis.extraCarrier[2].ifRun == false) {
                    mis.extraCarrier[2].ifRun = true;
                }
                else if (usingLab.store['XGH2O'] == 3000 && mis.extraCarrier[2].ifRun == true) {
                    mis.extraCarrier[2].ifRun = false;
                }

                if (usingLab.store['XGH2O'] < 450 && terminal.store['XGH2O'] < 450) {
                    mis.ultraUpgrader[0].ifRun = false;
                }
            }

            //control excarrier 5
            if (mis.extraCarrier[5].ifRun == true) {
                let terminal = <StructureTerminal>Game.getObjectById('5f0cd6ac716e443522c6d8af');
                if (terminal.store[RESOURCE_ENERGY] < 15000) {
                    mis.extraCarrier[5].ifRun = false;
                }
            }
        }
    };

    module.exports = temporary;
}