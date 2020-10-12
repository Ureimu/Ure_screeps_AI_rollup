interface RoomPosition {
    getSquare(): RoomPosition[],

}

interface StructureSpawn {
    spawnTask():void,
}

interface Source {
    /**
     * 返回周围正方形区域的不是wall的地形数量
     *
     * @returns {number} 非wall的空格个数
     */
    checkBlankSpace(): RoomPosition[],

    /**
     * source的名称.
     *
     * @type {string}
     * @memberof Source
     */
    name: string,

    /**
     * 初始化source的memory.
     *
     * @memberof Source
     */
    initsMemory(): void,

    /**
     * source的一个访问对应memory的捷径。
     *
     * @type {{[name: string]: SourceMemory}}
     * @memberof Source
     */
    memory: SourceMemory,

    /**
     * 任务管理函数。用来检测是否需要推送任务。
     *
     * @param {()=>bpgGene[]} manage_bodyParts 一个函数，返回bpgGene对象。
     * @memberof Source
     */
    check():CheckStatus,
}

interface Creep {
    pushBackTask():void
}

declare namespace NodeJS {
    interface Global {
        log: any,
        detail: ()=>void,
        bpg: (arg0: Array<bpgGene>)=>BodyPartConstant[],
        GenedGetBodyparts: Array<bpgGene>,
        GenedGetBodypartsNum: Array<bpgGene>,
        GenedBodypartsList: BodyPartConstant[],
        GenedBodypartsNum: number,
        GenedgetBpEnergyBodyparts:Array<bpgGene>,
        GenedgetBpEnergyBodypartsCost:number
        prototypeMounted: boolean,
        getNewSource():void,
        repushTask():void,
        getNum(arg0: number):number,
        CreepEnergyMonitorprototypeMounted:boolean,
        memoryReset():void,
        spawnTaskList:{[name: string]: (roomName: string) => BaseTaskInf[]},
        GUI:any,
        newTask(roomName:string,taskName:string):void,
        deleteTask(creepName:string):void,
        war:any,
    }
}
