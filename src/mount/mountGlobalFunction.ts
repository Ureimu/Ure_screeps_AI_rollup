import { getCutTiles, getMinCut, pruneDeadEnds, testMinCutSubset } from "construction/utils/minCut";
import actionCounter from "utils/actionCounter";
import profiler from "utils/profiler";

export function globalFunctionRegister(): void {//在global上写入全局函数对象
    if (!global.getNum) {
        global.getNum = function (num:number):number{
            let x=1;
            let u=0;
            for(let i=0;i<100;i++){
                u+=x*num;
                x*=0.95;
            }
            return u;
        }
    }
    else {
        return
    }

    if (!global.repushTask) {
        global.repushTask = function ():void{
            for(let roomName in Memory.rooms){
                for(let taskName in Memory.rooms[roomName].innerRoomTaskSet){
                    Memory.rooms[roomName].innerRoomTaskSet[taskName].hasPushed=false;
                }
            }
        }
    }

    if(!global.memoryReset) {
        global.memoryReset = function ():void{
            RawMemory.set("");
        }
    }

    if(!global.newTask) {
        global.newTask = function (roomName:string,taskName:string):void{
            Memory.rooms[roomName].innerRoomTaskSet[taskName].hasPushed=false;
        }
    }

    if(!global.deleteTask) {
        global.deleteTask = function (creepName:string):void{
            delete Memory.creeps[creepName];
            Game.creeps[creepName].suicide();
        }
    }

    if(!global.war) {
        global.war = {
        }
    }

    if (!global.detail) global.detail = actionCounter.singleTick; //打印所有任务的详细cpu消耗情况列表

    if(!global.help) {
        global.help = function ():string {
            return `profilerHelp
            Game.profiler.profile(ticks, [functionFilter]);
            Game.profiler.stream(ticks, [functionFilter]);
            Game.profiler.email(ticks, [functionFilter]);
            Game.profiler.background([functionFilter]);

            // Output current profile data.
            Game.profiler.output([lineCount]);
            Game.profiler.callgrind();

            // Reset the profiler, disabling any profiling in the process.
            Game.profiler.reset();

            Game.profiler.restart();`
        }
    }

    //测试时会使用的全局变量
    if(!global.minCut) {
        global.minCut={
            getMinCut,
            getCutTiles,
            pruneDeadEnds,
            testMinCutSubset,
            colonies:{},
            ifQuit:false,
            quit:()=>{global.minCut.ifQuit=true}
        }
        profiler.registerObject(global.minCut,"construction.minCut");
        for(let roomName in Memory.rooms){
            global.minCut.colonies[roomName]
        }
    }

    //main循环会一直调用的函数
    if(!global.stateLoop) {
        global.stateLoop={
            minCutVisual:()=>{
                if(global.minCut.graph&&!global.minCut.ifQuit){
                    const visual = new RoomVisual(global.minCut.graphingRoom);
                    visual.import(global.minCut.graph);
                }
            }
        }
        profiler.registerObject(global.stateLoop,"stateLoop");
    }
}
