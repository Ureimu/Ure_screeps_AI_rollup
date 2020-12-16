// crzytrane 13 March 2017 at 12:06
export function roomScan(room: Room, sampleSize: number): void {
    const terrainData = room.lookForAtArea<LOOK_TERRAIN>(LOOK_TERRAIN, 0, 0, 49, 49);
    const sampleBlockCount: number = 50 / sampleSize;

    const sampleBlocks: { [y: number]: { [x: number]: { freeSpaces: number } } } = {};
    let blockY: number;
    let blockX: number;
    let sampleY: number;
    let sampleX: number;
    for (blockY = 0; blockY < sampleBlockCount; blockY++) {
        sampleBlocks[blockY] = {};
        for (blockX = 0; blockX < sampleBlockCount; blockX++) {
            sampleBlocks[blockY][blockX] = { freeSpaces: 0 };

            for (sampleY = 0; sampleY < sampleSize; sampleY++) {
                for (sampleX = 0; sampleX < sampleSize; sampleX++) {
                    if (
                        terrainData[blockY * sampleSize + sampleY]?.[blockX * sampleSize + sampleX]?.[0]?.terrain !==
                        "wall"
                    ) {
                        sampleBlocks[blockY][blockX].freeSpaces++;
                    }
                }
            }
        }
    }
    for (const sampleYIndex in sampleBlocks) {
        for (const sampleXIndex in sampleBlocks[sampleYIndex]) {
            const x: number = Number(sampleXIndex) * sampleSize + sampleSize / 2;
            const y: number = Number(sampleYIndex) * sampleSize + sampleSize / 2;
            const percentageFree: number =
                sampleBlocks[sampleYIndex][sampleXIndex].freeSpaces / (sampleSize * sampleSize);

            const radius: number = (percentageFree * sampleSize) / 2;
            room.visual.circle(x, y, { radius, fill: "#fff", opacity: 0.2 });
            room.visual.text(sampleBlocks[sampleYIndex][sampleXIndex].freeSpaces.toString(), x, y + 0.25);
        }
    }
}
