import { manageCreep } from "task/manager";
import { RoomTask } from "task/utils/RoomTask"

// 自定义的 Creep 的拓展
export class CreepExtension extends Creep {
    // 自定义敌人检测
    checkEnemy() {
        // 代码实现...
    };
    // 填充所有 spawn 和 extension
    fillSpawnEngry() {
        // 代码实现...
    };
    // 填充所有 tower
    fillTower() {
        // 代码实现...
    };
    harvestEnergy() {

    }
    pushBackTask() {
        if(!!this.ticksToLive && this.ticksToLive<3){
            let roomTask = new RoomTask(this.room.name,this.memory.task.taskInf.taskType);
            roomTask.pushTaskToSpawn(manageCreep(<SpawnTaskInf>this.memory.task,this.room.name));
            this.suicide();
        }
    }
    // 其他更多自定义拓展
}
