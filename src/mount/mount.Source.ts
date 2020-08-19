import taskPool from "taskPool";
import { PriorityQueue } from "PriorityQueue";

// 自定义的 Source 的拓展
export class SourceExtension extends Source {
    /**
     * 返回周围正方形的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace(): number {
        let square:RoomPosition[] = this.pos.getSquare();
        let BlankSpace: number = 0;
        for (const squared of square) {
            const look = squared.look();
            look.forEach(function(lookObject) {
                if(lookObject.type == 'terrain' &&
                lookObject.terrain != 'wall') {
                    BlankSpace++;
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
        for(let i=0;i<Memory.sources[this.name].blankSpace;i++){
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
        for(let i=0;i<Memory.sources[this.name].blankSpace;i++){
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

        if(Game.time % 1500 == 0){
            let screeps_x = _.filter(Game.creeps, (creep) => creep.name.indexOf(this.name+'-H-') != -1);
            let bodypartsCount = 0;
            for (let i = 0; i < screeps_x.length; i++) {
                for(let body of screeps_x[i].body){
                    if(body.type == 'work'){
                        bodypartsCount++;
                    }
                }
            }
            if(bodypartsCount<5||screeps_x.length<Memory.sources[this.name].blankSpace){
                status.pushTask=true;
                status.pushTaskData={
                    pushSpawnTask:true,
                }
            }
        }

        return status;
    };
}
