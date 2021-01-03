import { RoomPositionStr } from "construction";

export function getPosFromStr(str: RoomPositionStr): RoomPosition {
    const matched = regMatch(str);
    if (matched) {
        const pos = new RoomPosition(Number(matched[1]), Number(matched[2]), matched[3]);
        return pos;
    } else {
        global.log("getPosFromStr失败！");
        return new RoomPosition(0, 0, "E0S0");
    }
}

export function setPosToStr(pos: RoomPosition): string {
    return `x${pos.x}y${pos.y}r${pos.roomName}`;
}

export function genePosStr(x: number, y: number, roomName: string): string {
    return `x${x}y${y}r${roomName}`;
}

/**
 * 返回给定范围内的位置字符串集合，注意该函数不会检查位置的合理性。
 *
 * @export
 * @param {RoomPositionStr} str
 * @param {number} range
 * @returns
 */
export function getPosStrInRange(str: RoomPositionStr, range: number): Set<string> {
    const matched = regMatch(str);
    const strSet = new Set<string>();
    if (matched) {
        const x = Number(matched[1]);
        const y = Number(matched[2]);
        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                strSet.add(`x${x + i}y${y + j}r${matched[3]}`);
            }
        }
    }
    return strSet;
}

export function getQuadPosStr(str: RoomPositionStr): Set<string> {
    const matched = regMatch(str);
    const strSet = new Set<string>();
    if (matched) {
        const x = Number(matched[1]);
        const y = Number(matched[2]);
        const sign = [-1, 1];
        for (const i of sign) {
            for (const j of sign) {
                strSet.add(`x${x + i}y${y + j}r${matched[3]}`);
            }
        }
    }
    return strSet;
}

export function getDiagPosStr(str: RoomPositionStr): Set<string> {
    const matched = regMatch(str);
    const strSet = new Set<string>();
    if (matched) {
        const x = Number(matched[1]);
        const y = Number(matched[2]);
        const sign = [-1, 1];
        for (const i of sign) {
            strSet.add(`x${x + i}y${y}r${matched[3]}`);
            strSet.add(`x${x}y${y + i}r${matched[3]}`);
        }
    }
    return strSet;
}

interface Coord {
    x: number;
    y: number;
}

export function ParseCoord(str: RoomPositionStr): Coord {
    const matched = regMatch(str);
    const coord = {
        x: -1,
        y: -1
    };
    if (matched) {
        coord.x = Number(matched[1]);
        coord.y = Number(matched[2]);
    }
    return coord;
}

export function getRangeToPosStr(str1: RoomPositionStr, str2: RoomPositionStr): number {
    const matched1 = regMatch(str1);
    const matched2 = regMatch(str2);
    let range = -1;
    if (matched1 && matched2) {
        range = Math.max(
            Math.abs(Number(matched1[1]) - Number(matched2[1])),
            Math.abs(Number(matched1[2]) - Number(matched2[2]))
        );
    }
    return range;
}

export function reverseSet(set: Set<string>): Set<string> {
    const mList: string[] = [];
    set.forEach(posStr => {
        mList.push(posStr);
    });
    set = new Set(mList.reverse());
    return set;
}

function regMatch(str: string) {
    const regexp = /^x(\d{1,2})y(\d{1,2})r([EW]\d{1,2}[NS]\d{1,2})$/;
    const reg = new RegExp(regexp);
    const matched = reg.exec(str);
    return matched;
}
