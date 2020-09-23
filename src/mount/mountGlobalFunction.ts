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
                for(let taskName in Memory.rooms[roomName].pushTaskSet){
                    Memory.rooms[roomName].pushTaskSet[taskName].hasPushed=false;
                }
            }
        }
    }
}
