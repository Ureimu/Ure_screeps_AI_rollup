export function getCenterConstruction(room: Room){
    if(room.controller){
        if(!Memory.rooms[room.name].constructionSchedule.center){
            let path = PathFinder.search(room.find(FIND_MY_SPAWNS)[0].pos,{pos:room.controller.pos,range: 3},{maxOps: 5000})
            if(path.path.length>0){
                let lastpoint = <RoomPosition>path.path.pop();
                let posList = getBlankDiagonalSquarePlace(lastpoint);
                return posList
            }else {
                console.log("[build] 寻找建筑中心点时发生错误：没有到controller的路径。");
                return []
            }
        }else{
            return RoomPositionStrListToRoomPositionList(<RoomPositionStr[]>Memory.rooms[room.name].constructionSchedule.center.centerPos)
        }
    }else{
        console.log("[build] 寻找建筑中心点时发生错误：房间没有controller。");
        return [];
    }
}

function RoomPositionStrListToRoomPositionList(posStrList:RoomPositionStr[]):RoomPosition[]{
    let posList = [];
    for(let posStr of posStrList){
        posList.push(new RoomPosition(posStr.x,posStr.y,posStr.roomName));
    }
    return posList;
}

export function getBlankDiagonalSquarePlace(point:RoomPosition){
    let lastpoint = point;
    let square = lastpoint.getSquare()
    let numList=[[0,2],[1,1],[-1,1],[0,0]]
    let sign = [[1,1],[1,-1],[-1,-1],[-1,1]]
    let signNumListAll = []
    let centerPos:RoomPosition[]=[];
    for(let i = 0;i<4;i++){
        let signNumList = numList
        signNumList.map((pos,j)=>{pos=[pos[0]*sign[j][0],pos[1]*sign[j][1]]; return pos})
        signNumListAll.push(signNumList)
    }
    for(let pos of square){
        for(let i = 0;i<4;i++){
            let rectPosList:RoomPosition[] = [];
            for(let j = 0;j<4;j++){
                let m = new RoomPosition(pos.x+signNumListAll[i][j][0],pos.y+signNumListAll[i][j][1],pos.roomName);
                let x = m.lookFor(LOOK_STRUCTURES)
                if(x.length!=0){
                    rectPosList.splice(0)
                    break;
                }
                rectPosList.push(m);
            }
            if(rectPosList.length == 4){
                centerPos = rectPosList;
                break;
            }
        }
    }
    return centerPos
}
