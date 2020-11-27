export function getPosfromStr(str:RoomPositionStr){
    let regexp = /^x(\d{1,2})y(\d{1,2})r([EW]\d{1,2}[NS]\d{1,2})$/
    let matched = str.match(regexp)
    if(matched){
        let pos = new RoomPosition(~~matched[1],~~matched[2],matched[3]);
        return pos;
    }else{
        console.log("getPosfromStr失败！")
        return new RoomPosition(0,0,"E0S0");
    }
}

export function setPosToStr(pos:RoomPosition){
    return `x${pos.x}y${pos.y}r${pos.roomName}`;
}
