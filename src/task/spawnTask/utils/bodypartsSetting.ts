import { getBpEnergy, getBpNum } from "AllUtils/bodypartsGenerator";

let roleList: { [name: string]: bpgGene[] } = {
    'harvestSource': [{ move: 1, work: 2 }, { carry: 1 }],
    'buildAndRepair': [{ move: 1, work: 1, carry: 1 }],
    'carrySource': [{ move: 1, carry: 2 }],
    'upgradeController': [{ move: 1, carry: 1, work: 1 }],
    'carryResource': [{ move: 1, carry: 2 }],
};

export function getBpByRole(roleName: string, roomName: string) {

    for (let key in roleList) {
        if (key == roleName) {
            //只对第一个部件对象进行repeat操作。
            let i = _.floor(
                (Game.rooms[roomName].energyCapacityAvailable -
                    getBpEnergy(roleList[key]) +
                    getBpEnergy([roleList[key][0]])) /
                    getBpEnergy([roleList[key][0]])
            );
            roleList[key][0].repeat = i;
            if(getBpNum(roleList[key])<=50){
                return roleList[key];
            } else {
                let i = _.floor(
                    (50 -
                        getBpNum(roleList[key]) +
                        getBpNum([roleList[key][0]])) /
                        getBpNum([roleList[key][0]])
                );
                roleList[key][0].repeat = i;
                return roleList[key];
            }
        }
    }

    console.log("没有该任务名称，身体部件生成失败:"+roomName+roleName);
    return [{}];
}
