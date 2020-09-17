export function bpg(bodyparts: Array<bpgGene>): BodyPartConstant[] {
    /**
     *一个bodyparts生成器。
    具体使用示例：
    传入：[{'move':1,'work':1},{'move':2,'carry':2}]
    传出：['move','work','move','move','carry','carry']
    *
    * @param {Array<bpgGene>} bodyparts 一个由多个bpgGene类型构成的数组。
    * @returns {BodyPartConstant[]} 身体部件常量列表。
    */
    if (!!global.GenedGetBodyparts && bodyparts == global.GenedGetBodyparts) return global.GenedBodypartsList; //如果上一次的和这一次的设置一样，则跳过。
    let bodypartsList: BodyPartConstant[] = [];
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        let repeatNum = 1;
        if (bodyparts[i].repeat !== undefined) {
            repeatNum = <number>bodyparts[i]["repeat"];
        }
        if (repeatNum == 1) {
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        bodypartsList.push(<BodyPartConstant>key);
                    }
                }
            }
        } else {
            let nowList: BodyPartConstant[] = [];
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        nowList.push(<BodyPartConstant>key);
                    }
                }
            }
            for (let i = 0; i < repeatNum; i++) {
                bodypartsList = bodypartsList.concat(nowList);
            }
        }
    }
    global.GenedGetBodyparts = bodyparts;
    global.GenedBodypartsList = bodypartsList;
    return bodypartsList;
}

export function getBpNum(bodyparts: Array<bpgGene>, bodypartName: BodyPartConstant): number {
    /**
     *一个bodyparts生成器。
    具体使用示例：
    传入：[{'move':1,'work':1},{'move':2,'carry':2}]
    传出：['move','work','move','move','carry','carry']
    *
    * @param {Array<bpgGene>} bodyparts 一个由多个bpgGene类型构成的数组。
    * @returns {BodyPartConstant[]} 身体部件常量列表。
    */
    if (!!global.GenedGetBodypartsNum && bodyparts == global.GenedGetBodypartsNum) return global.GenedBodypartsNum; //如果上一次的和这一次的设置一样，则跳过。
    let bodypartNumber = 0;
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        let repeatNum = 1;
        if (bodyparts[i].repeat !== undefined) {
            repeatNum = <number>bodyparts[i]["repeat"];
        }
        for (let key in bodyparts[i]) {
            if (key == bodypartName) {
                bodypartNumber += <number>bodyparts[i][key] * repeatNum;
            }
        }
    }
    global.GenedGetBodypartsNum = bodyparts;
    global.GenedBodypartsNum = bodypartNumber;
    return bodypartNumber;
}

export function getBpEnergy(bodyparts: Array<bpgGene>): number {
    if (!!global.GenedgetBpEnergyBodyparts && bodyparts == global.GenedgetBpEnergyBodyparts)
        return global.GenedgetBpEnergyBodypartsCost; //如果上一次的和这一次的设置一样，则跳过。
    let enengyNum = 0;
    let bodypartCost = {
        move: 50,
        work: 100,
        carry: 50,
        attack: 80,
        ranged_attack: 150,
        heal: 250,
        claim: 600,
        tough: 10
    };
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        let repeatNum = 1;
        if (bodyparts[i].repeat !== undefined) {
            repeatNum = <number>bodyparts[i]["repeat"];
        }
        if (repeatNum == 1) {
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        enengyNum += bodypartCost[<BodyPartConstant>key];
                    }
                }
            }
        } else {
            let nowEnergy: number = 0;
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        nowEnergy += bodypartCost[<BodyPartConstant>key];
                    }
                }
            }
            enengyNum += nowEnergy * repeatNum;
        }
    }
    global.GenedgetBpEnergyBodyparts = bodyparts;
    global.GenedgetBpEnergyBodypartsCost = enengyNum;
    return enengyNum;
}

export function getBpByRole(roleName: string, roomName: string) {
    let roleList: { [name: string]: bpgGene[] } = {
        'harvestSource': [{ move: 1, work: 2 }, { carry: 1 }],
        'buildAndRepair': [{ move: 1, work: 1, carry: 1 }],
        'carrySource': [{ move: 1, carry: 2 }],
        'upgradeController': [{ move: 1, carry: 1, work: 1 }]
    };

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
            return roleList[key];
        }
    }

    console.log("没有该任务名称，身体部件生成失败:"+roomName+roleName);
    return [{}];
}
