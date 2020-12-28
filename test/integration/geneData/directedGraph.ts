export function getDirectedGraph(data: analyseData, idData: nameToId): string {
    const outputData: outputData = data.map(direction => {
        const newData: singleOutputData = [
            { baseType: "baseType", idType: "idType", namedType: "namedType" },
            { baseType: "baseType", idType: "idType", namedType: "namedType" },
            0,
            0,
            "unknownRoom"
        ];
        // 起点分类对应名称，终点分类对应名称，值，游戏时间，房间名
        // 根据1.type分类，2.建筑名称分类
        for (const id in idData) {
            for (let i = 0; i < 2; i++) {
                if (direction[i] === id) {
                    newData[i] = idData[id].type;
                    if (newData[4] === "unknownRoom") {
                        if (idData[id].room.length === 1) {
                            newData[4] = idData[id].room[0].room;
                        }
                        idData[id].room.forEach((pos, index, array) => {
                            if (
                                index - 1 >= 0 &&
                                direction[3] >= array[index - 1].gameTime &&
                                direction[3] <= array[index].gameTime
                            ) {
                                newData[4] = pos.room;
                            }
                        });
                    }
                }
            }
        }
        if (newData[0].baseType !== "baseType" && newData[1].baseType !== "baseType" && newData[4] !== "unknownRoom") {
            newData[2] = direction[2];
            newData[3] = direction[3];
            return newData;
        } else {
            throw new Error(
                `id没有对应名称:${JSON.stringify(direction, undefined, 4)},${JSON.stringify(newData, undefined, 4)}`
            );
        }
    });
    return `${JSON.stringify(outputData)}`;
}
