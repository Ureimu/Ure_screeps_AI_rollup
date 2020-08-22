export class RoomTaskObject{
    /**
     *Creates an instance of RoomTaskObject.
    * @param {string} roomName 房间名称
    * @param {boolean} [ismyRoom] 是否判断该房间为已经拥有的房间，如果判断为没有拥有的房间，则到时间也不会执行任务
    * @param {string} [roomTaskName] 任务类别的名称
    * @param {number} [interval] 执行任务的间隔，以tick为单位
    * @param {*} [bodyparts] 创建的spawnTask的身体部件属性
    * @param {boolean} [runNow] 是否立即执行，不影响interval计时器继续倒数
    * @param {*} [ifPushNewSpawnTask] 传入值被用来判断是否在interval到了的时候进行新的生成creep任务推送。
    * @param {*} [NewSpawnTask] 新的spawn任务对象。会被用来推送。
    * @param {boolean} [ifAllocateNewSpawnTaskToSpawn] 是否立即分配任务到spawn,如果现在不分配，会在下一次一起分配。
    * @memberof RoomTaskObject
    */

    private _interval?: number
    public roomName: string
    constructor(
        roomName: string,
        ismyRoom?: boolean,
        roomTaskName?: string,
        interval?: number,
        bodyparts?: any,
        runNow?: boolean,
        ifPushNewSpawnTask?: any,
        NewSpawnTask?: any,
        ifAllocateNewSpawnTaskToSpawn?: boolean,
    ) {
        this.roomName = roomName;
    };
    get interval(){
        if(!!this._interval){
            return this._interval;
        }
        else{
            return -1;
        }
    };
    set interval(number:number){
        this._interval=number;
        Memory.rooms[this.roomName].taskPool
    }
}
