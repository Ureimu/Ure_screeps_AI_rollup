let create_and_keep_screeps = require('c_k_screeps');
const stateScanner = require('stateScanner');
const tower_sp = require('tower');
let c_k_info = require('c_k_info');
const temporary = require('temporarySetting');
const link_sp = require('link');
const getMission = require('getMission');
const htmj = require('htmlwithjs');
// 上面是非角色模块，下面是常驻角色模块
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRenovator = require('role.renovator');
const roleCarrier = require('role.carrier');
const roleEnergyMiner = require('role.energyMiner');
//上面是常驻角色模块，下面是非常驻角色模块
const roleExtraCarrier = require('role.extraCarrier');
const roleAttacker = require('role.attacker');
const roleOutwardsEnengyMiner = require('role.outwardsEnergyMiner');
const roleClaimer = require('role.claimer');
const roleUltraUpgrader = require('role.ultraUpgrader');

module.exports.loop = function () {

    //htmj.meset('<p><big>这个文本字体放大</big>,<i>这个文本是斜体的</i>,<strong>这个文本是加粗的</strong>\n</p>','test');
    //console.log(Memory.consoleTest.x);
    c_k_info.run();
    link_sp.run();
    getMission.run();
    temporary.runMission();
    for (let name in Memory.creeps) { //自动清理
        if (!Game.creeps[name]) {
            interface Options { color: string; volume: number }
            if (Memory.creeps[name].spawnName) {
                Memory.stats.creep_num[Memory.creeps[name].spawnName][Memory.creeps[name].role] -= 1;
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
        if(Memory.creeps[name] && Object.keys(Memory.creeps[name]).length == 0 && Game.creeps[name].spawning==false) {
            if (Memory.creeps[name].spawnName) {
                Memory.stats.creep_num[Memory.creeps[name].spawnName][Memory.creeps[name].role] -= 1;
            }
            Game.creeps[name].suicide();
            console.log('Clearing non-existing memory of the creep:', name);
        }
    }

    function create_and_keep_screeps_list(nameList, numberList, bodyparts, spawnName) {
        for (let i = 0; i < nameList.length; i++) {
            create_and_keep_screeps.run(nameList[i], numberList[i], bodyparts[nameList[i]], spawnName);
        }
    }

    for (const spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        if (!spawn.spawning) {
            for (let name in Game.rooms) { //自动生成screeps
                if (spawn.room.name == name) {
                    for (let i = 0, j = Memory.c_k_info.energyAvailableList.length; i < j; i++) {
                        if ( 
                            Game.rooms[name].energyAvailable >= Memory.c_k_info.energyAvailableList[i]) { //能量从高到低
                            create_and_keep_screeps_list(Memory.c_k_info.creepRoleList[i], Memory.c_k_info.creepSpawnNumberList[i], Memory.c_k_info.bodypartSetting[i], spawnName);
                            break;
                        }
                    }
                }
            }
        }
    }

    let roleToRunList = [roleHarvester, roleUpgrader, roleBuilder, roleRenovator, roleCarrier, roleEnergyMiner];
    if (!Memory.c_k_info.creepRoleListGivenOut) {
        Memory.c_k_info.creepRoleListGivenOut = ['harvester', 'upgrader', 'builder', 'renovator', 'carrier', 'energyMiner'];
    }

    for (let name in Game.creeps) { //按照不同模块运行
        let creep = Game.creeps[name];
        for (let i = 0, j = Memory.c_k_info.creepRoleListGivenOut.length; i < j; i++) {
            if (creep.memory.role == Memory.c_k_info.creepRoleListGivenOut[i]) {
                roleToRunList[i].run(creep);
            }
        }
    }

    let roleToRunListOutwards = [roleExtraCarrier,roleAttacker,roleOutwardsEnengyMiner,roleClaimer,roleUltraUpgrader];
    if (!Memory.c_k_info.creepRoleListGivenOutOutwards) {
        Memory.c_k_info.creepRoleListGivenOutOutwards = ['extraCarrier', 'attacker', 'outwardsEnergyMiner', 'claimer','ultraUpgrader'];
    }

    temporary.workSetting();

    for (let name in Game.creeps) { //按照不同模块运行
        let creep = Game.creeps[name];
        for (let i = 0, j = Memory.c_k_info.creepRoleListGivenOutOutwards.length; i < j; i++) {
            for (let m = 0, n = Memory.creepWorkSetting[Memory.c_k_info.creepRoleListGivenOutOutwards[i]].length; m < n; m++) {
                if (creep.memory.role == Memory.c_k_info.creepRoleListGivenOutOutwards[i] ) {
                    temporary.run(creep);
                    roleToRunListOutwards[i].run(creep);
                }
            }
        }
    }

    for (let i = 0, j = Memory.c_k_info.creepRoleListGivenOutOutwards.length; i < j; i++) {
        for (let m = 0, n = Memory.creepWorkSetting[Memory.c_k_info.creepRoleListGivenOutOutwards[i]].length; m < n; m++) {
            roleToRunListOutwards[i].keep(m);
        }
    }

    stateScanner.run();

    for (let roomName in Game.rooms) { //tower自动防御
        let towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            }
        );
        if (towers) {
            tower_sp.defend(Game.rooms[roomName].name);
            roomName = Game.rooms[roomName].name;
            tower_sp.repair(roomName, 3000);
        }
    }
}