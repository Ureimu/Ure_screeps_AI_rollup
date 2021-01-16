import { RoomPositionStr } from "construction";

interface Coord {
    x: number;
    y: number;
}
export class RoomPositionToStr {
    public roomName: string | undefined;

    /**
     *Creates an instance of RoomPositionToStr.
     * @param {string} [roomName] 如果不为空，则使用方法时返回的字符串不会带上roomName，即为x21y45的形式而不是x42y32rE1N2的形式。
     * @memberof RoomPositionToStr
     */
    public constructor(roomName?: string) {
        if (roomName) this.roomName = roomName;
    }

    public regMatch(str: string): RegExpExecArray | null {
        if (!this.roomName) {
            const regexp = /^x(\d{1,2})y(\d{1,2})r([EW]\d{1,2}[NS]\d{1,2})$/;
            const reg = new RegExp(regexp);
            const matched = reg.exec(str);
            return matched;
        } else {
            const regexp = /^x(\d{1,2})y(\d{1,2})$/;
            const reg = new RegExp(regexp);
            const matched = reg.exec(str);
            return matched;
        }
    }

    public getPosFromStr(str: RoomPositionStr): RoomPosition {
        const matched = this.regMatch(str);
        if (!this.roomName) {
            if (matched) {
                const pos = new RoomPosition(Number(matched[1]), Number(matched[2]), matched[3]);
                return pos;
            } else {
                global.log("getPosFromStr失败！");
                return new RoomPosition(0, 0, "E0S0");
            }
        } else {
            if (matched) {
                const pos = new RoomPosition(Number(matched[1]), Number(matched[2]), this.roomName);
                return pos;
            } else {
                global.log("getPosFromStr失败！");
                return new RoomPosition(0, 0, "E0S0");
            }
        }
    }

    public setPosToStr(pos: RoomPosition): string {
        if (!this.roomName) {
            return `x${pos.x}y${pos.y}r${pos.roomName}`;
        } else {
            return `x${pos.x}y${pos.y}`;
        }
    }

    public genePosStr(x: number, y: number, roomName?: string): string {
        if (!this.roomName && roomName) {
            return `x${x}y${y}r${roomName}`;
        } else if (!roomName) {
            return `x${x}y${y}`;
        } else {
            return "";
        }
    }

    /**
     * 返回给定范围内的位置字符串集合，注意该函数不会检查位置的合理性。
     *
     * @export
     * @param {RoomPositionStr} str
     * @param {number} range
     * @returns
     */
    public getPosStrInRange(str: RoomPositionStr, range: number): Set<string> {
        if (!this.roomName) {
            const matched = this.regMatch(str);
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
        } else {
            const matched = this.regMatch(str);
            const strSet = new Set<string>();
            if (matched) {
                const x = Number(matched[1]);
                const y = Number(matched[2]);
                for (let i = -range; i <= range; i++) {
                    for (let j = -range; j <= range; j++) {
                        strSet.add(`x${x + i}y${y + j}`);
                    }
                }
            }
            return strSet;
        }
    }

    public getQuadPosStr(str: RoomPositionStr): Set<string> {
        if (!this.roomName) {
            const matched = this.regMatch(str);
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
        } else {
            const matched = this.regMatch(str);
            const strSet = new Set<string>();
            if (matched) {
                const x = Number(matched[1]);
                const y = Number(matched[2]);
                const sign = [-1, 1];
                for (const i of sign) {
                    for (const j of sign) {
                        strSet.add(`x${x + i}y${y + j}`);
                    }
                }
            }
            return strSet;
        }
    }

    public getDiagPosStr(str: RoomPositionStr): Set<string> {
        if (!this.roomName) {
            const matched = this.regMatch(str);
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
        } else {
            const matched = this.regMatch(str);
            const strSet = new Set<string>();
            if (matched) {
                const x = Number(matched[1]);
                const y = Number(matched[2]);
                const sign = [-1, 1];
                for (const i of sign) {
                    strSet.add(`x${x + i}y${y}`);
                    strSet.add(`x${x}y${y + i}`);
                }
            }
            return strSet;
        }
    }

    public ParseCoord(str: RoomPositionStr): Coord {
        const matched = this.regMatch(str);
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

    public getRangeToPosStr(str1: RoomPositionStr, str2: RoomPositionStr): number {
        const matched1 = this.regMatch(str1);
        const matched2 = this.regMatch(str2);
        let range = -1;
        if (matched1 && matched2) {
            range = Math.max(
                Math.abs(Number(matched1[1]) - Number(matched2[1])),
                Math.abs(Number(matched1[2]) - Number(matched2[2]))
            );
        }
        return range;
    }

    public reverseSet(set: Set<string>): Set<string> {
        const mList: string[] = [];
        set.forEach(posStr => {
            mList.push(posStr);
        });
        set = new Set(mList.reverse());
        return set;
    }
}
