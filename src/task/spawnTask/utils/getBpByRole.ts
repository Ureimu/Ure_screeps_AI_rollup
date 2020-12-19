import { RoleBodySetting } from "task/taskClass/RoleBodySetting";
import { getBpEnergy, getBpNum } from "utils/bodypartsGenerator";

export function getBpByRole(roleName: string, taskKindName: string, roomName: string): bpgGene[] {
    const roleList = new RoleBodySetting(Game.rooms[roomName]).roleBodySettingList;

    for (const key1 in roleList) {
        if (key1 === taskKindName) {
            for (const key2 in roleList[key1]) {
                if (key2 === roleName) {
                    const roleBodySetting = roleList[key1][key2].bodysetting;
                    // 只对第一个部件对象进行repeat操作。
                    const i = Math.max(
                        _.floor(
                            (Game.rooms[roomName].energyAvailable -
                                getBpEnergy(roleBodySetting) +
                                getBpEnergy([roleBodySetting[0]])) /
                                getBpEnergy([roleBodySetting[0]])
                        ),
                        1
                    );
                    roleBodySetting[0].repeat = i;
                    if (getBpNum(roleBodySetting) <= roleList[key1][key2].maxBodyParts) {
                        return roleBodySetting;
                    } else {
                        roleBodySetting[0].repeat = 1;
                        const num = getBpNum(roleBodySetting);
                        const num0 = getBpNum([roleBodySetting[0]]);
                        const notFix = (roleList[key1][key2].maxBodyParts - num + num0) / num0;
                        const repeatNum = _.floor(notFix);
                        const j = repeatNum >= 1 ? repeatNum : 1;
                        // console.log(`(${roleList[key2].maxBodyParts} - ${num} +${num0}) /${num0} = ${notFix} = ${i} = ${repeatNum}`)
                        roleBodySetting[0].repeat = j;
                        return roleBodySetting;
                    }
                }
            }
        }
    }

    console.log("没有该任务名称，身体部件生成失败:" + roomName + roleName);
    return [{}];
}
