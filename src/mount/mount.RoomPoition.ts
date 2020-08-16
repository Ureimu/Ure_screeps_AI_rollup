// 将拓展签入 RoomPosition 原型
export function mountRoomPositionEx() {
    _.assign(RoomPosition.prototype, RoomPositionExtension);
}

// 自定义的 Source 的拓展
class RoomPositionExtension extends RoomPosition {
        /**
     * 返回一个在该pos正方形周围的pos数组,顺序为按照时钟12点为起点顺时针旋转.
     *
     * @returns 在该pos正方形周围的pos数组.
     */
    getSquare() {
        let squareList: RoomPosition[] = [];
        let squarePos: number[] = [0, 1, 1, 1, 1, 0, 1, -1, 0, -1, -1, -1, -1, 0, -1, 1]
        for (let i = 0; i < 16; i += 2) {
            squareList.push(new RoomPosition(this.x + squarePos[i], this.y + squarePos[i + 1], this.roomName))
        }
        return squareList;
    };
    // 填充所有 spawn 和 extension
    fillSpawnEngry() {
        // 代码实现...
    };
    // 填充所有 tower
    fillTower() {
        // 代码实现...
    };
}
