/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

let c_k_info_m = { //注意：在更改了以下设置后，需要在游戏中手动删除一次Memory.c_k_info，设置才能生效。
    run: function () {

        if (!Memory.c_k_info.bodypartSetting) { //身体部件
            let p=[
                (global.bpg([{'move':1,'work':2,'carry':1}])),
                (global.bpg([{'move':3,'work':3,'carry':2}])), //3W2C3M
                (global.bpg([{'move':4,'work':4,'carry':3}])), //4W3C4M
                (global.bpg([{'move':5,'work':5,'carry':5}])), //5W5C5M
                (global.bpg([{'move':7,'work':6,'carry':7}])), //6W7C7M
                (global.bpg([{'move':10,'work':7,'carry':12}])), //7W12C10M
                (global.bpg([{'move':10,'work':7,'carry':12}]))
            ];
            let m=[
                (global.bpg([{'move':3,'carry':3}])),
                (global.bpg([{'move':6,'carry':5}])),
                (global.bpg([{'move':10,'carry':10}])),
                (global.bpg([{'move':10,'carry':10}])),
                (global.bpg([{'move':10,'carry':18}])),
                (global.bpg([{'move':12,'carry':24}])),
                (global.bpg([{'move':15,'carry':30}]))
            ];
            let i=[
                (global.bpg([{'move':1,'work':2,'carry':1}])),
                (global.bpg([{'move':4,'work':3,'carry':1}])), //3W2C3M
                (global.bpg([{'move':4,'work':5,'carry':1}])), //4W3C4M
                (global.bpg([{'move':5,'work':7,'carry':1}])), //5W5C5M
                (global.bpg([{'move':9,'work':8,'carry':1}])), //6W7C7M
                (global.bpg([{'move':13,'work':11,'carry':1}])), //7W12C10M
                (global.bpg([{'move':13,'work':11,'carry':1}]))
            ]
            Memory.c_k_info.bodypartSetting = [
                {
                    'upgrader': p[0],
                    'builder': p[0],
                    'carrier': m[0],
                    'energyMiner': i[0]
                },
                {
                    'upgrader': p[1],
                    'builder': p[1],
                    'renovator': p[1],
                    'carrier': m[1],
                    'energyMiner': i[1]
                },
                {
                    'upgrader': p[2],
                    'builder': p[2],
                    'renovator': p[2],
                    'carrier': m[2],
                    'energyMiner': i[2]
                },
                {
                    'upgrader': p[3],
                    'builder': p[3],
                    'renovator': p[3],
                    'carrier': m[3],
                    'energyMiner': i[3]
                },
                {
                    'upgrader': p[4],
                    'builder': p[4],
                    'renovator': p[4],
                    'carrier': m[4],
                    'energyMiner': i[4]
                },
                {
                    'upgrader': p[5],
                    'builder': p[5],
                    'renovator': p[5],
                    'carrier': m[5],
                    'energyMiner': i[5]
                },
                {
                    'upgrader': p[6],
                    'builder': p[6],
                    'renovator': p[6],
                    'carrier': m[6],
                    'energyMiner': i[6]
                }
            ];
            Memory.c_k_info.bodypartSetting.reverse(); // TODO 在之后设定成不同职位有不同部件比较好,最好能够将该设定分离出来，以后在另一个文件统一设定。
        }
        if (!Memory.c_k_info.creepRoleList) {
            Memory.c_k_info.creepRoleList = [
                ['upgrader', 'builder', 'carrier', 'energyMiner'],
                ['upgrader', 'builder', 'renovator', 'carrier', 'energyMiner'],
                ['upgrader', 'builder', 'renovator', 'carrier', 'energyMiner'],
                ['upgrader', 'builder', 'renovator', 'carrier', 'energyMiner'],
                ['upgrader', 'builder', 'renovator', 'carrier', 'energyMiner'],
                ['upgrader', 'builder', 'renovator', 'carrier', 'energyMiner'],
                ['upgrader', 'builder', 'renovator', 'carrier', 'energyMiner']
            ];
            Memory.c_k_info.creepRoleList.reverse();
        }
        if (!Memory.c_k_info.creepSpawnNumberList) {
            Memory.c_k_info.creepSpawnNumberList = [
                [2, 2, 2, 2],
                [2, 2, 1, 2, 2],
                [1, 1, 1, 2, 2],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1]
            ];
            Memory.c_k_info.creepSpawnNumberList.reverse();
        }
        if (!Memory.c_k_info.energyAvailableList) {
            Memory.c_k_info.energyAvailableList = [300, 550, 800, 1050, 1300, 1800, 2300];
            Memory.c_k_info.energyAvailableList.reverse();
        }

        for (const spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];
            if (spawn.spawning) { //创建screep时的生产图标
                let spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y, {
                        align: 'left',
                        opacity: 0.8
                    });
            }
        }
    }
};

module.exports = c_k_info_m;