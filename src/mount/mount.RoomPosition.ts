// 自定义的 RoomPosition 的拓展
export class RoomPositionExtension extends RoomPosition {
    /**
     * 返回一个在该pos正方形周围的pos数组,顺序为按照时钟12点为起点顺时针旋转.
     *
     * @returns 在该pos正方形周围的pos数组.
     */
    public getSquare(): RoomPosition[] {
        const squareList: RoomPosition[] = [];
        const squarePos: number[] = [0, 1, 1, 1, 1, 0, 1, -1, 0, -1, -1, -1, -1, 0, -1, 1];
        for (let i = 0; i < 16; i += 2) {
            squareList.push(new RoomPosition(this.x + squarePos[i], this.y + squarePos[i + 1], this.roomName));
        }
        return squareList;
    }
    /**
     * 返回一个在该pos正方形周围的上下左右的pos数组,顺序为按照时钟12点为起点顺时针旋转.
     *
     * @returns 在该pos正方形周围的上下左右的pos数组.
     */
    public getDiagSquare(): RoomPosition[] {
        const squareList: RoomPosition[] = [];
        const squarePos: number[] = [0, 1, 1, 0, 0, -1, -1, 0];
        for (let i = 0; i < 8; i += 2) {
            squareList.push(new RoomPosition(this.x + squarePos[i], this.y + squarePos[i + 1], this.roomName));
        }
        return squareList;
    }
    /**
     * 返回一个在该pos正方形周围的四个角的pos数组,顺序为按照时钟12点为起点顺时针旋转.
     *
     * @returns 在该pos正方形周围的四个角的pos数组.
     */
    public getQuadSquare(): RoomPosition[] {
        const squareList: RoomPosition[] = [];
        const squarePos: number[] = [1, 1, 1, -1, -1, -1, -1, 1];
        for (let i = 0; i < 8; i += 2) {
            squareList.push(new RoomPosition(this.x + squarePos[i], this.y + squarePos[i + 1], this.roomName));
        }
        return squareList;
    }
    public checkBlankSpace(): RoomPosition[] {
        const square: RoomPosition[] = this.getSquare();
        const BlankSpace: RoomPosition[] = [];
        for (const squared of square) {
            const look = squared.look();
            look.forEach(function (lookObject) {
                if (lookObject.type === "terrain" && lookObject.terrain !== "wall") {
                    BlankSpace.push(squared);
                }
            });
        }
        return BlankSpace;
    }
    public toStr(): string {
        return `x${this.x}y${this.y}r${this.roomName}`;
    }
    // 填充所有 spawn 和 extension
    public fillSpawnEngry(): void {
        // 代码实现...
    }
    // 填充所有 tower
    public fillTower(): void {
        // 代码实现...
    }
}
