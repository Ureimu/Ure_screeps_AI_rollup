import taskPool from "task/utils/taskPool";
import { PriorityQueue } from "task/utils/PriorityQueue";

// 自定义的 Source 的拓展
export class SourceExtension extends Source {
    /**
     * 返回周围正方形的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace():RoomPosition[] {
        let square:RoomPosition[] = this.pos.getSquare();
        let BlankSpace: RoomPosition[] = [];
        for (const squared of square) {
            const look = squared.look();
            look.forEach(function(lookObject) {
                if(lookObject.type == 'terrain' &&
                lookObject.terrain != 'wall') {
                    BlankSpace.push(squared);
                }
            });
        }
        return BlankSpace;
    };

    /**
     * 初始化source的memory.
     *
     */
    initsMemory(): void {
        this.name = this.room.name+'Source'+'['+this.pos.x+','+this.pos.y+']';
        Memory.sources[this.name]={
            id : this.id,
            blankSpace : this.checkBlankSpace(),
            taskPool : {
                spawnQueue: [],
                taskQueue: [],
            },
        };
    };

    makeHarvestTask(): void{
        let workerTask: PriorityQueue = taskPool.initQueue('taskQueue', Memory.sources[this.name].taskPool);
        for(let i=0;i<Memory.sources[this.name].blankSpace.length;i++){
            workerTask.push({
                sponsor: this.id,
                priority: 10,
                isRunning: false,
                taskInf: {
                    source: Memory.sources[this.name],
                }
            });
        }
        taskPool.setQueue(workerTask,'taskQueue',Memory.sources[this.name].taskPool);
    };

    makeSpawnTask(manage_bodyParts: ()=>bpgGene[]): void{
        let spawnTask: PriorityQueue = taskPool.initQueue('spawnQueue',Memory.sources[this.name].taskPool)
        for(let i=0;i<Memory.sources[this.name].blankSpace.length;i++){
            spawnTask.push(
                {
                    sponsor: this.id,
                    priority : 10,
                    isRunning: false,
                    taskInf: {
                        bodyparts: manage_bodyParts(),
                        creepName: this.name+'-H-'+`${i+1}`,
                    }
                },
            )
        }
        taskPool.setQueue(spawnTask,'spawnQueue',Memory.sources[this.name].taskPool);
    };

    check(): CheckStatus{
        let status={
            update: false,//更新参数
            updateData: {},
            pushTask: false,//推送任务
            pushTaskData: {},
            changeStatus: false,//改变任务状态
            changeStatusData: {},
        }

        let screeps_x = _.filter(Game.creeps, (creep) => creep.name.indexOf(this.name+'-H-') != -1);
        let bodypartsCount = 0;
        for (let i = 0; i < screeps_x.length; i++) {
            for(let body of screeps_x[i].body){
                if(body.type == 'work'){
                    bodypartsCount++;
                }
            }
        }
        if(bodypartsCount<5||screeps_x.length<Memory.sources[this.name].blankSpace.length){
            status.pushTask=true;
            status.pushTaskData={
                pushSpawnTask:true,
                interval:1500,
            }
            console.log('[task] 尝试推送任务...');
        }else{
            status.pushTask=true;
            status.pushTaskData={
                pushSpawnTask:false,
                interval:100,
            }
        }

        return status;
    };
}
