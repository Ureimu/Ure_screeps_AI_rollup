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
