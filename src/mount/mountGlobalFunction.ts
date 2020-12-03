import { getGridLayout } from "construction/composition/gridLayout";
import { getCutTiles, getMinCut, pruneDeadEnds, testMinCutSubset } from "construction/utils/minCut";
import downloader from "utils/downloader";
import profiler from "utils/profiler";

export function globalFunctionRegister(): void {//在global上写入全局函数对象
    global.getNum = function (num:number):number{
        let x=1;
        let u=0;
        for(let i=0;i<100;i++){
            u+=x*num;
            x*=0.95;
        }
        return u;
    }

    global.repushTask = function ():void{
        for(let roomName in Memory.rooms){
            for(let taskName in Memory.rooms[roomName].innerRoomTaskSet){
                Memory.rooms[roomName].innerRoomTaskSet[taskName].hasPushed=false;
            }
        }
    }

    global.memoryReset = function ():void{
        RawMemory.set("");
    }

    global.newTask = function (roomName:string,taskName:string):void{
        Memory.rooms[roomName].innerRoomTaskSet[taskName].hasPushed=false;
    }

    global.deleteTask = function (creepName:string):void{
        delete Memory.creeps[creepName];
        Game.creeps[creepName].suicide();
    }

    global.war = {
    }

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

    //测试时会使用的全局变量
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

    //main循环会一直调用的函数
    global.stateLoop={
        minCutVisual:()=>{
            if(global.minCut.graph&&!global.minCut.ifQuit){
                const visual = new RoomVisual(global.minCut.graphingRoom);
                visual.import(global.minCut.graph);
            }
        }
    }

    global.state = {};

    global.test = {};

    global.test.runGridLayout=getGridLayout

    global.test.download = downloader.download

    profiler.registerObject(global.stateLoop,"stateLoop");

}
//test.runGridLayout(Game.rooms["W8N3"])
