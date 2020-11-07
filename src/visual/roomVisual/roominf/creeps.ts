import { getBpNum } from "utils/bodypartsGenerator";
/**
 * 取得某一个房间的spawn正在维持的creep的部件总数。
 *
 * @export
 * @param {string} roomName
 * @returns 某一个房间正在维持的creep的部件总数.
 */
export function getBpSum(roomName: string) {
    let m = 0;
    _.filter(Game.creeps, (k: Creep) => k.name.slice(0, k.name.indexOf("-")) == roomName).forEach(creep => {
        m += getBpNum(creep.memory.bodyparts);
    });
    return m;
}
