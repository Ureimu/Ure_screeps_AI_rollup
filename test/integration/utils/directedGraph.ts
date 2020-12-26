export function getDirectedGraph(data: analyseData, idData: nameToId): string {
    data = data.map(direction => {
        const newData: [Record<string, unknown>, Record<string, unknown>, string | number, number, string] = [
            {},
            {},
            0,
            0,
            ""
        ];
        // 起点分类对应名称，终点分类对应名称，值，游戏时间，房间名
        // 根据1.type分类，2.建筑名称分类
        for (const id in idData) {
            for (let i = 0; i < 2; i++) {
                if (direction[i] === id) {
                    newData[i] = idData[id].type;
                    if (!newData[4]) {
                        if (typeof idData[id].room === "string") {
                            newData[4] = idData[id].room as string;
                        } else {
                            (idData[id].room as roomPosData[]).forEach((pos, index, array) => {
                                if (
                                    index - 1 >= 0 &&
                                    direction[3] > array[index - 1].gameTime &&
                                    direction[3] < array[index].gameTime
                                ) {
                                    newData[4] = pos.room;
                                }
                            });
                        }
                    }
                }
            }
            if (Object.keys(newData[0]).length !== 0 && Object.keys(newData[1]).length !== 0 && newData[4] !== "") {
                newData[2] = direction[2];
                newData[3] = direction[3];
                return newData;
            }
        }
        console.log("id没有对应名称");
        return direction;
    }) as analyseData;
    return `${JSON.stringify(data)}`;
}
