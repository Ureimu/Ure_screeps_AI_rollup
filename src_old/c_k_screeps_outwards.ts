//作为非常态对外creep生产保持函数
//TODO 基本功能已经完成，继续增加常用函数。
//支持产生数量和产出时间的设定，支持使用参数判断是否执行。
//现在的使用方式是在对应角色的keep函数下调用该模块来生产creep。
// 后续打算再添加一些常用的判断函数。

let c_k_screeps_outwards = { //用来创建对外的，执行特殊任务的，非常态化的creep。
    /**
     *生产creep的函数。
     *函数先执行一次ifFunction，如果返回值为true，会在指定spawn产生特定角色的creep，并在memory写入targetRoom和spawnName。
     *否则什么也不做。
     *
     * @param {string} name creep的名称
     * @param {Array<BodyPartConstant>} bodyparts creep的身体部件
     * @param {string} spawnName 指定的spawn名称
     * @param {string} targetRoom 目标房间
     * @param {Boolean} ifFunction 能够返回布尔值的判断函数
     * @param {Number} missionNumber 任务编号
     */
    trySpawn: function (name: any, bodyparts: any, spawnName, targetRoom: any, ifFunction: any, missionNumber: any) {
        let spawn = Game.spawns[spawnName];
        let screeps_x = _.filter(Game.creeps, (creep: { memory: { role: any; spawnName: string; }; }) => creep.memory.role == name && creep.memory.spawnName == spawn.name); //报告该screeps数量

        /**
         * 以角色名称和给定部件产生creep。
         * 如果执行成功，会在Memory里写入相关参数，如creep数量。
         * 如果执行失败，会在控制台返回相应的报错信息。
         *
         * @param {string} name creep的职位名称
         * @param {Array} bodyparts creep的部件
         */
        function spawnCreepByRole(name, bodyparts: any[]) { //name是creep的名称，bodyparts是部件
            let newName = name + Game.time + [spawn.name];
            let ifOk = spawn.spawnCreep(bodyparts, newName, {
                memory: {
                    role: name,
                    spawnName: spawnName,
                    targetRoom: targetRoom,
                    missionNumber: missionNumber
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
                return 0;
            } else if (ifOk == ERR_NOT_ENOUGH_ENERGY) {
                console.log('warning: spawning ' + bodyparts.join() + ' low energy, spawning failed');
                return -404;
            } else if (ifOk == ERR_BUSY) {
                return -500;
            } else {
                console.log('warning: spawning failed,return: ' + ifOk);
                return ifOk;
            }
        }

        if (ifFunction) {
            spawnCreepByRole(name, bodyparts);
        }
    },


    /**
     *一个ifFunction的例子，可以用来保持恒定数量的creep。
     *
     * @param {Number} number 需要保持的数量
     * @param {string} screepName screep角色
     * @param {string} spawnName 出生点名称
     * @param {Number} missionNumber 任务编号
     * @returns {Boolean} boolean
     */
    keepCreepNumber: function (number: number, screepName: any, spawnName, missionNumber: any) {
        let spawn = Game.spawns[spawnName];
        let screeps_x = _.filter(Game.creeps, (creep: { memory: { role: any; spawnName: string; missionNumber: any; }; }) => creep.memory.role == screepName 
        && creep.memory.spawnName == spawn.name && creep.memory.missionNumber == missionNumber); //报告该screeps数量
        if (screeps_x.length < number) {
            return true;
        } else {
            return false;
        }
    },

    /**
     *移动函数，用于让creep移动到指定房间。
     *
     * @param {creep} creep
     * @returns 如果到达指定房间，返回true，否则返回false
     */
    goToRoom: function (creep: { room: { name: any; }; memory: { targetRoom: string; }; moveTo: (arg0: RoomPosition, arg1: { visualizePathStyle: { stroke: string; }; }) => void; }) {
        if (creep.room.name != creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 20, creep.memory.targetRoom),
            {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
            return false;
        }
        else {
            return true;
        }
    },

    moveToRoom: function (creep: { room: { name: any; }; moveTo: (arg0: RoomPosition, arg1: { visualizePathStyle: { stroke: string; }; }) => void; }, roomName: string) {
        if (creep.room.name != roomName) {
            creep.moveTo(new RoomPosition(25, 20, roomName),
            {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
            return false;
        }
        else {
            return true;
        }
    }
}

module.exports = c_k_screeps_outwards;