export function getPosfromStr(str: RoomPositionStr) {
    let matched = regMatch(str);
    if (matched) {
        let pos = new RoomPosition(~~matched[1], ~~matched[2], matched[3]);
        return pos;
    } else {
        console.log("getPosfromStr失败！");
        return new RoomPosition(0, 0, "E0S0");
    }
}

export function setPosToStr(pos: RoomPosition) {
    return `x${pos.x}y${pos.y}r${pos.roomName}`;
}

export function genePosStr(x:number,y:number,roomName:string){
    return `x${x}y${y}r${roomName}`
}

/**
 * 返回给定范围内的位置字符串集合，注意该函数不会检查位置的合理性。
 *
 * @export
 * @param {RoomPositionStr} str
 * @param {number} range
 * @returns
 */
export function getPosStrInRange(str: RoomPositionStr, range: number) {
    let matched = regMatch(str);
    let strSet = new Set<string>();
    if (matched) {
        let x = ~~matched[1];
        let y = ~~matched[2];
        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                strSet.add(`x${x + i}y${y + j}r${matched[3]}`);
            }
        }
    }
    return strSet;
}

export function getQuadPosStr(str: RoomPositionStr) {
    let matched = regMatch(str);
    let strSet = new Set<string>();
    if (matched) {
        let x = ~~matched[1];
        let y = ~~matched[2];
        let sign = [-1, 1];
        for (let i of sign) {
            for (let j of sign) {
                strSet.add(`x${x + i}y${y + j}r${matched[3]}`);
            }
        }
    }
    return strSet;
}

export function getDiagPosStr(str: RoomPositionStr) {
    let matched = regMatch(str);
    let strSet = new Set<string>();
    if (matched) {
        let x = ~~matched[1];
        let y = ~~matched[2];
        let sign = [-1, 1];
        for (let i of sign) {
            strSet.add(`x${x + i}y${y}r${matched[3]}`);
            strSet.add(`x${x}y${y + i}r${matched[3]}`);
        }
    }
    return strSet;
}

export function ifExistCenter(strSet: Set<string>) {
    strSet;
}

export function getPosCoordfromStr(str: RoomPositionStr) {
    let matched = regMatch(str);
    let coord = {
        x:-1,
        y:-1
    }
    if (matched) {
        coord.x = ~~matched[1];
        coord.y = ~~matched[2];
    }
    return coord
}

export function getRangeToPosStr(str1: RoomPositionStr,str2: RoomPositionStr){
    let matched1 = regMatch(str1);
    let matched2 = regMatch(str2);
    let range = -1;
    if(matched1&&matched2){
        range=Math.max(Math.abs(~~matched1[1]-~~matched2[1]),Math.abs(~~matched1[2]-~~matched2[2]))
    }
    return range
}

export function reverseSet(set:Set<string>){
    let mlist: string[] = [];
    set.forEach(posStr => {
        mlist.push(posStr);
    });
    set = new Set(mlist.reverse());
    return set
}

function regMatch(str:string){
    let regexp = /^x(\d{1,2})y(\d{1,2})r([EW]\d{1,2}[NS]\d{1,2})$/;
    let matched = str.match(regexp);
    return matched
}
