let moduleOx = { //用来保持screeps的数量，一般用于需要保持稳定数量的screeps。


    run: function (name, number, bodyparts, spawnName) {
        let spawn = Game.spawns[spawnName];
        let screeps_x = _.filter(Game.creeps, (creep) => creep.memory.role == name && creep.room.name == spawn.room.name); //报告该房间screeps数量
        let bodypartsCount = 0;
        let roomname = spawn.room.name;
        for (let i = 0; i < screeps_x.length; i++) {
            bodypartsCount += screeps_x[i].body.length;
        }

        if (!Memory.reset_time_recorder) {
            Memory.reset_time_recorder = {};
        }

        if (!Memory.time_recorder[spawn.name]) { //检查数量的时间间隔，用来给予harvester足够的时间间隔去补充用于生产creeps的能量
            Memory.time_recorder[spawn.name] = 0;
        }

        /**
         * 以角色名称和给定部件产生creep。
         * 如果执行成功，会在Memory里写入相关参数，如creep数量。
         * 如果执行失败，会在控制台返回相应的报错信息。
         *
         * @param {string} name creep的职位名称
         * @param {Array} bodyparts creep的部件
         */
        function spawnCreepByRole(name, bodyparts) { //name是creep的名称，bodyparts是部件
            let newName = name + Game.time + [spawn.name];
            let ifOk = spawn.spawnCreep(bodyparts, newName, {
                memory: {
                    role: name,
                    spawnName: spawnName
                }
            });
            if (ifOk == OK) {
                console.log('Spawning new ' + name + ': ' + newName);
                if (!Memory.stats.creep_num[spawn.name]) {
                    Memory.stats.creep_num[spawn.name] = {};
                }
                if (!Memory.stats.creep_num[spawn.name][name]) {
                    Memory.stats.creep_num[spawn.name][name] = 0;
                }
                Memory.stats.creep_num[spawn.name][name] = screeps_x.length + 1;
                console.log(name + ' changed: ' + Memory.stats.creep_num[spawn.name][name]);
                Memory.reset_time_recorder[spawn.name] = true;
            } else if (ifOk == ERR_NOT_ENOUGH_ENERGY) {
                console.log('warning: spawning ' + bodyparts.join() + ' low energy, spawning failed');
                Memory.reset_time_recorder[spawn.name] = true;
            } else if (ifOk == ERR_BUSY) {} else {
                console.log('warning: spawning failed,return: ' + ifOk);
            }
        }

        if (name == ('harvester' || 'energyMiner' || 'carrier') && screeps_x.length == 0) { //第一个harvester的生产无视计时器，因为缺少它会导致生产creep效率低下
            spawnCreepByRole(name, bodyparts);
        }

        if (screeps_x.length < number && Memory.time_recorder[spawn.name] > 0 && spawn.spawnCreep([WORK, CARRY, MOVE], 'test', {
                dryRun: true
            }) != ERR_BUSY) {
            //计时器的时间速度取决于有多少个职位是存在空缺的，但是某个职位的具体缺少人数不影响速度，同时在孵化creep时会暂停计数器。
            Memory.time_recorder[spawn.name] -= 2;
        }

        if ((screeps_x.length < number && name == ('harvester' || 'energyMiner' || 'carrier') && Memory.time_recorder[spawn.name] > 4 && Memory.time_recorder[spawn.name] < 16) ||
            (screeps_x.length < number && name == ('harvester' || 'energyMiner' || 'carrier') && (Game.rooms[roomname].energyAvailable == Game.rooms[roomname].energyCapacityAvailable))) { //满能量直接生产
            spawnCreepByRole(name, bodyparts);
        } else if ((screeps_x.length < number && Memory.time_recorder[spawn.name] < 4) ||
            (screeps_x.length < number && (Game.rooms[roomname].energyAvailable == Game.rooms[roomname].energyCapacityAvailable))) { //检查screeps个数并自动补充，满能量直接生产
            spawnCreepByRole(name, bodyparts);
        }

        let container = spawn.room.find(FIND_STRUCTURES, { //标明房间内的容器
            filter: (i) => i.structureType == STRUCTURE_CONTAINER
        });

        if (screeps_x.length < number && Memory.reset_time_recorder[spawn.name] == true) {
            Memory.reset_time_recorder[spawn.name] = false;
            Memory.time_recorder[spawn.name] = (spawn.room.controller.level * 30 + number * 10 + bodypartsCount * 4 + ((container.length > 0 && Memory.stats.containerEnergyNum[spawnName] > 5000) ? 0 : 480));
            //计时器的初始时间取决于该房间controller的等级，要求保持的creep数量，还有该房间内的该职位creep部件总数，还有container的能量值。当没有container时，不会触发该条件判断。
            if (name == ('harvester' || 'energyMiner' || 'carrier') && screeps_x.length == 0) {
                Memory.time_recorder[spawn.name] += ((spawn.room.controller.level <= 3) ? 0 : spawn.room.controller.level - 2) * 170;
            } //这个是对harvester的特别增加时间，因为harvester供给能量需要一定时间
        }
    }
}

module.exports = moduleOx;