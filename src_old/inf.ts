/**
 * 全局统计信息扫描器
 * 负责搜集关于creep的相关信息
 */{
let inf = {
    creepNum: function () {
        if (!Memory.creepNum) {
            console.log(JSON.stringify(Memory.stats.creep_num, null, 4));
        } else {
            console.log('no creep');
        }
    },

    containerEnergyNum: function (roomName) {
        let container = <StructureContainer[]>Game.rooms[roomName].find(FIND_STRUCTURES, { //标明房间内的容器
            filter: (i) => i.structureType == (STRUCTURE_CONTAINER)
        });
        let sum = 0;
        for (let i = 0; i < container.length; i++) {
            sum += container[i].store[RESOURCE_ENERGY];
        }
        return sum;
    },

    storageEnergyNum: function (roomName) {
        if(Game.rooms[roomName].storage) {
            let storage = Game.rooms[roomName].storage;
            let sum = 0;
            sum = storage.store[RESOURCE_ENERGY];
            return sum;
        }
    }
};

module.exports = inf;
 }